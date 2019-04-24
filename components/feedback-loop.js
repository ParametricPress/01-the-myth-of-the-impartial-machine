const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600;
const height = 250;
const margin = {top: 40, right: 10, bottom: 0, left: 100};
const PCTFORMAT = d3.format(".0%");

const r = 5;
const totalTrials = 30;

const xScale = d3.scaleLinear()
  .domain([0, 9])
  .range([0, 10*(r * 2 + 1)]);


// initial parameters (eventually come from props)
let n_a;  // number of observed crimes in neighborhood A
let n_b;  // number of observed crimes in neighborhood B
let lambda_a;  // crime rate of neighborhood A
let lambda_b;  // crime rate of neighborhood B

let total_a;  // total number of crimes that occurred in A
let total_b;  // total number of crimes that occurred in B
let sent_to_a = 0;  // total number of times officer sent to A
let sent_to_b = 0;  // total number of times officer sent to B

let crimeData;

class FeedbackLoopComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    // d3.select(node).attr("class", props.class);
    n_a = +props.crimeRateA;
    n_b = +props.crimeRateB;
    lambda_a = +props.crimeRateA;
    lambda_b = +props.crimeRateB;
    total_a = n_a;
    total_b = n_b;
    crimeData = generateData(n_a, n_b, totalTrials);
    console.log(crimeData);

    // set up main parts of the interactive
    const dispatchedToLabel = d3.select(node).append("div")
      .attr("class", "dispatchedToLabel")
      .text("Day 0");

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr("id", "feedbackLoopPlot")
      .style('width', '100%')
      .style('height', '100%');

    const finalResults = d3.select(node).append("div").attr("class", "finalResults hidden");

    // draw initial plot

    // label neighborhoods
    svg.append("text")
      .attr("class", "neighborhoodLabel neighborhoodA")
      .attr("x", margin.left + (r*2 + 1) * 5)
      .attr("y", 20)
      .text("A");

    svg.append("text")
      .attr("class", "neighborhoodLabel neighborhoodB")
      .attr("x", margin.left + (width/2) + (r*2 + 1) * 5)
      .attr("y", 20)
      .text("B");

    drawDots(svg, crimeData);

    // set up final results section
    const observedCrimesA = finalResults.append("div").attr("class", "observedCrimesA");
    const observedCrimesB = finalResults.append("div").attr("class", "observedCrimesB");
    const totalCrimesA = finalResults.append("div").attr("class", "totalCrimesA");
    const totalCrimesB = finalResults.append("div").attr("class", "totalCrimesB");
    const pctSentToA = finalResults.append("div").attr("class", "pctSentToA");
    const pctSentToB = finalResults.append("div").attr("class", "pctSentToB");
  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    if (props.runSimulation !== oldProps.runSimulation) {
      // console.log(props.crimeRateA, props.crimeRateB, props.runSimulation);
      // console.log("Old props:", oldProps.crimeRateA, oldProps.crimeRateB, oldProps.runSimulation);

      // BUG? oldProps are getting updated with current props for crimeRateA and crimeRateB
      // if user has changed the crime rate settings and is rerunning the simulation:
      if(+props.crimeRateA !== lambda_a || +props.crimeRateB !== lambda_b){
        n_a = +props.crimeRateA;
        n_b = +props.crimeRateB;
        lambda_a = +props.crimeRateA;
        lambda_b = +props.crimeRateB;
        total_a = n_a;
        total_b = n_b;
        sent_to_a = 0;
        sent_to_b = 0;
        crimeData = generateData(n_a, n_b, totalTrials);
        console.log(crimeData);

        // redraw dots in plot
        d3.selectAll("#feedbackLoopPlot g").remove();

        let svg = d3.select("#feedbackLoopPlot");
        drawDots(svg, crimeData);
      }

      d3.select(".finalResults").classed("hidden", true);
      d3.select(".observedCrimesA").html("Observed crimes in <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>" + n_a + "</span>");
      d3.select(".observedCrimesB").html("Observed crimes in <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>" + n_b + "</span>");
      d3.select(".totalCrimesA").html("Total actual crimes in <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>" + total_a + " (" + PCTFORMAT(total_a/(total_a + total_b)) + ")" + "</span>");
      d3.select(".totalCrimesB").html("Total actual crimes in <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>" + total_b + " (" + PCTFORMAT(total_b/(total_a + total_b)) + ")" + "</span>");
      d3.select(".pctSentToA").html("Percent of time officer sent to <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>" + PCTFORMAT(sent_to_a/totalTrials) + "</span>");
      d3.select(".pctSentToB").html("Percent of time officer sent to <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>" + PCTFORMAT(sent_to_b/totalTrials) + "</span>");


      let day = 0; // TODO: need to figure out a way to interrupt the autoplay if the user clicks the button before the current simulation has finished
      let t = d3.interval(function(elapsed) {
        // console.log(day, total_a, total_b);
        day++;

        if(d3.selectAll(".feedbackDot.neighborhoodA.day" + day).nodes().length > 0) {
          d3.select(".dispatchedToLabel").html("Day " + day + "/" + totalTrials + ": Officer sent to <span class='neighborhoodA'>A</span>");
        }
        else {
          d3.select(".dispatchedToLabel").html("Day " + day + "/" + totalTrials + ": Officer sent to <span class='neighborhoodB'>B</span>");
        }

        d3.selectAll(".feedbackDot.neighborhoodA")
          .transition(500)
          .delay(500)
          .style("opacity", function(d) { return d.day <= day ? 1 : 0; });

        d3.selectAll(".feedbackDot.neighborhoodB")
          .transition(500)
          .delay(500)
          .style("opacity", function(d) { return d.day <= day ? 1 : 0; });

        if(day === totalTrials) {
          d3.select(".finalResults").classed("hidden", false);
          t.stop();
        }

      }, 1000);
    }
  }
}

function generateData(n_a, n_b, totalTrials) {
  let data_a = initializeData(n_a, "A");
  let data_b = initializeData(n_b, "B");
  for(let i = 1; i < totalTrials + 1; i++) {
    let location = dispatchOfficer();
    location == "A" ? updateData(data_a, "A", i, lambda_a) : updateData(data_b, "B", i, lambda_b);
    total_a += lambda_a;
    total_b += lambda_b;
  }

  return [data_a, data_b];
}

function initializeData(n, location) {
  let data = [];
  for(let i = 0; i < n; i++) {
    data.push({"neighborhood": location, "day": 0, "crime": 1});
  }
  return data;
}

function dispatchOfficer() {
   let r = Math.random();
   let v = r * (n_a + n_b);

   if(v <= n_a) {
    // console.log("Officer sent to Neighborhood A");
    sent_to_a++;
    n_a += lambda_a;
    return "A";
   }
   else if(v > n_a) {
    // console.log("Officer sent to Neighborhood B");
    sent_to_b++;
    n_b += lambda_b;
    return "B";
   }
}

function updateData(data, location, day, crimeRate) {
  for(let i = 0; i < crimeRate; i++) {
    data.push({"neighborhood": location, "day": day, "crime": 1});
  }
}

function drawDots(svg, datasets) {
  console.log(svg.node());
  const dots_a = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll(".feedbackDot")
    .data(datasets[0])
    .enter()
    .append("circle")
    .attr("class", function(d) { return "feedbackDot neighborhoodA day" + d.day; })
    .attr("r", r)
    .attr("cx", function(d, i) { return xScale(i % 10); })
    .attr("cy", function(d, i) { return Math.floor(i / 10) * (r * 2 + 2); })
    .style("opacity", function(d) { return d.day === 0 ? 1 : 0; });

  const dots_b = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll(".feedbackDot")
    .data(datasets[1])
    .enter()
    .append("circle")
    .attr("class", function(d) { return "feedbackDot neighborhoodB day" + d.day; })
    .attr("r", r)
    .attr("cx", function(d, i) { return width/2 + xScale(i % 10); })
    .attr("cy", function(d, i) { return Math.floor(i / 10) * (r * 2 + 2); })
    .style("opacity", function(d) { return d.day === 0 ? 1 : 0; });
}

module.exports = FeedbackLoopComponent;
