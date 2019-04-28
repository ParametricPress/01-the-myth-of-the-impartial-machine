const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600;
const height = 200;
const margin = {top: 40, right: 10, bottom: 0, left: 100};
const PCTFORMAT = d3.format(".0%");

const r = 5;
const totalTrials = 14;

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
let history = [];

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

    const finalResults = d3.select(node).append("div").attr("class", "finalResults");

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

    // draw initial plot
    drawDots(svg, crimeData);

    // set up final results section
    finalResults.append("div").attr("class", "pctSentToA").html("Officer sent to <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>0</span>");
    finalResults.append("div").attr("class", "pctSentToB").html("Officer sent to <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>0</span>");
    finalResults.append("div").attr("class", "observedCrimesA").html("Observed crimes in <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>" + history[0].observed_a + " (" + PCTFORMAT(history[0].observed_a/(history[0].observed_a + history[0].observed_b)) + ")</span>");
    finalResults.append("div").attr("class", "observedCrimesB").html("Observed crimes in <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>" + history[0].observed_b + " (" + PCTFORMAT(history[0].observed_b/(history[0].observed_a + history[0].observed_b)) + ")</span>");
    finalResults.append("div").attr("class", "totalCrimesA").html("Total actual crimes in <span class='neighborhoodA'>A</span>: <span class='neighborhoodA'>" + history[0].total_a + " (" + PCTFORMAT(history[0].total_a/(history[0].total_a + history[0].total_b)) + ")</span>");
    finalResults.append("div").attr("class", "totalCrimesB").html("Total actual crimes in <span class='neighborhoodB'>B</span>: <span class='neighborhoodB'>" + history[0].total_b + " (" + PCTFORMAT(history[0].total_b/(history[0].total_a + history[0].total_b)) + ")</span>");
  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    if(props.crimeRateA !== oldProps.crimeRateA || props.crimeRateB !== oldProps.crimeRateB) {
      d3.select(".feedbackLoopRunBtn").text("Run simulation");
    }

    if (props.runSimulation !== oldProps.runSimulation) {
      // console.log(props.crimeRateA, props.crimeRateB, props.runSimulation);
      // console.log("Old props:", oldProps.crimeRateA, oldProps.crimeRateB, oldProps.runSimulation);

      // BUG? oldProps are getting updated with current props for crimeRateA and crimeRateB
      // if user has changed the crime rate settings and is rerunning the simulation:
      if(+props.crimeRateA !== lambda_a || +props.crimeRateB !== lambda_b){
        history = [];
        n_a = +props.crimeRateA;
        n_b = +props.crimeRateB;
        lambda_a = +props.crimeRateA;
        lambda_b = +props.crimeRateB;
        total_a = n_a;
        total_b = n_b;
        sent_to_a = 0;
        sent_to_b = 0;
        crimeData = generateData(n_a, n_b, totalTrials);
        // console.log(crimeData);

        // reset title to "Day 0" and reset table
        d3.select(".dispatchedToLabel").text("Day 0");
        d3.select(".pctSentToA span.neighborhoodA:nth-child(2)").text("0");
        d3.select(".pctSentToB span.neighborhoodB:nth-child(2)").text("0");
        d3.select(".observedCrimesA span.neighborhoodA:nth-child(2)").text(history[0].observed_a + " (" + PCTFORMAT(history[0].observed_a/(history[0].observed_a + history[0].observed_b)) + ")");
        d3.select(".observedCrimesB span.neighborhoodB:nth-child(2)").text(history[0].observed_b + " (" + PCTFORMAT(history[0].observed_b/(history[0].observed_a + history[0].observed_b)) + ")");
        d3.select(".totalCrimesA span.neighborhoodA:nth-child(2)").text(history[0].total_a + " (" + PCTFORMAT(history[0].total_a/(history[0].total_a + history[0].total_b)) + ")");
        d3.select(".totalCrimesB span.neighborhoodB:nth-child(2)").text(history[0].total_b + " (" + PCTFORMAT(history[0].total_b/(history[0].total_a + history[0].total_b)) + ")");

        // redraw dots in plot
        d3.selectAll("#feedbackLoopPlot g").remove();

        let svg = d3.select("#feedbackLoopPlot");
        drawDots(svg, crimeData);
      }

      d3.select(".feedbackLoopRunBtn").attr("disabled", true);
      d3.selectAll(".feedbackLoopCrimeRateSelector input[type='radio']").attr("disabled", true);

      let day = 0; // TODO: need to figure out a way to interrupt the autoplay if the user clicks the button before the current simulation has finished
      let t = d3.interval(function(elapsed) {
        // console.log(day, total_a, total_b);
        day++;

        // update title with day number and neighborhood officer dispatched to
        if(d3.selectAll(".feedbackDot.neighborhoodA.day" + day).nodes().length > 0) {
          d3.select(".dispatchedToLabel").html("Day " + day + "/" + totalTrials + ": Officer sent to <span class='neighborhoodA' style='opacity:0'>A</span>");
        }
        else {
          d3.select(".dispatchedToLabel").html("Day " + day + "/" + totalTrials + ": Officer sent to <span class='neighborhoodB' style='opacity:0'>B</span>");
        }
        d3.select(".dispatchedToLabel span")
          .transition(500)
          .style("opacity", 1);

        // update dots
        d3.selectAll(".feedbackDot.neighborhoodA")
          .transition(500)
          .delay(500)
          .style("opacity", function(d) { return d.day <= day ? 1 : 0; })
          .on("end", function() {
            // d3.select(".finalResults").classed("hidden", true);
            d3.select(".pctSentToA span.neighborhoodA:nth-child(2)").text(history[day].sent_to_a + " (" + PCTFORMAT(history[day].pct_sent_a) + ")");
            d3.select(".pctSentToB span.neighborhoodB:nth-child(2)").text(history[day].sent_to_b + " (" + PCTFORMAT(history[day].pct_sent_b) + ")");
            d3.select(".observedCrimesA span.neighborhoodA:nth-child(2)").text(history[day].observed_a + " (" + PCTFORMAT(history[day].observed_a/(history[day].observed_a + history[day].observed_b)) + ")");
            d3.select(".observedCrimesB span.neighborhoodB:nth-child(2)").text(history[day].observed_b + " (" + PCTFORMAT(history[day].observed_b/(history[day].observed_a + history[day].observed_b)) + ")");
            d3.select(".totalCrimesA span.neighborhoodA:nth-child(2)").text(history[day].total_a + " (" + PCTFORMAT(history[day].total_a/(history[day].total_a + history[day].total_b)) + ")");
            d3.select(".totalCrimesB span.neighborhoodB:nth-child(2)").text(history[day].total_b + " (" + PCTFORMAT(history[day].total_b/(history[day].total_a + history[day].total_b)) + ")");
          });

        d3.selectAll(".feedbackDot.neighborhoodB")
          .transition(500)
          .delay(500)
          .style("opacity", function(d) { return d.day <= day ? 1 : 0; })
          .on("end", function() {
            // d3.select(".finalResults").classed("hidden", true);
            d3.select(".pctSentToA span.neighborhoodA:nth-child(2)").text(history[day].sent_to_a + " (" + PCTFORMAT(history[day].pct_sent_a) + ")");
            d3.select(".pctSentToB span.neighborhoodB:nth-child(2)").text(history[day].sent_to_b + " (" + PCTFORMAT(history[day].pct_sent_b) + ")");
            d3.select(".observedCrimesA span.neighborhoodA:nth-child(2)").text(history[day].observed_a + " (" + PCTFORMAT(history[day].observed_a/(history[day].observed_a + history[day].observed_b)) + ")");
            d3.select(".observedCrimesB span.neighborhoodB:nth-child(2)").text(history[day].observed_b + " (" + PCTFORMAT(history[day].observed_b/(history[day].observed_a + history[day].observed_b)) + ")");
            d3.select(".totalCrimesA span.neighborhoodA:nth-child(2)").text(history[day].total_a + " (" + PCTFORMAT(history[day].total_a/(history[day].total_a + history[day].total_b)) + ")");
            d3.select(".totalCrimesB span.neighborhoodB:nth-child(2)").text(history[day].total_b + " (" + PCTFORMAT(history[day].total_b/(history[day].total_a + history[day].total_b)) + ")");
          });


        if(day === totalTrials) {
          // d3.select(".finalResults").classed("hidden", false);
          t.stop();
          d3.select(".feedbackLoopRunBtn").attr("disabled", null);
          d3.select(".feedbackLoopRunBtn").text("Replay simulation");
          d3.selectAll(".feedbackLoopCrimeRateSelector input[type='radio']").attr("disabled", null);
        }

      }, 2000);
    }
  }
}

function generateData(initial_a, initial_b, totalTrials) {
  let data_a = initializeData(initial_a, "A");
  let data_b = initializeData(initial_b, "B");
  history.push({observed_a: initial_a, observed_b: initial_b, total_a: initial_a, total_b: initial_b, sent_to_a: 0, pct_sent_a: 0, sent_to_b: 0, pct_sent_b: 0});

  for(let i = 1; i < totalTrials + 1; i++) {
    let location = dispatchOfficer();
    location == "A" ? updateData(data_a, "A", i, lambda_a) : updateData(data_b, "B", i, lambda_b);
    total_a += lambda_a;
    total_b += lambda_b;
    history.push({observed_a: n_a, observed_b: n_b, total_a: total_a, total_b: total_b, sent_to_a: sent_to_a, pct_sent_a: sent_to_a/i, sent_to_b: sent_to_b, pct_sent_b: sent_to_b/i});
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
