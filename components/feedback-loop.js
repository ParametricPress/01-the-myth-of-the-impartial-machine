const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600;
const height = 400;
const margin = {top: 20, right: 0, bottom: 0, left: 0};

const r = 4;
const totalTrials = 10;

const xPos = d3.scaleOrdinal()
  .domain(["A", "B"])
  .range([width * 0.25, width * 0.75]);

const simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.5).x(function(d) { return xPos(d.neighborhood); }))
    .force("y", d3.forceY().strength(0.5).y(height/2))
    .force("center", d3.forceCenter(width/2, height/2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(0.1).radius(r + 1).iterations(5)); // Force that avoids circle overlapping

// initial parameters (eventually come from props)
let n_a = 12;  // number of observed crimes in neighborhood A
let n_b = 10;  // number of observed crimes in neighborhood B
let lambda_a = 3;  // crime rate of neighborhood A
let lambda_b = 2;  // crime rate of neighborhood B

let total_a = n_a;  // total number of crimes that occurred in A (initially equal to number of observed crimes)
let total_b = n_b;  // total number of crimes that occurred in B
let sent_to_a = 0;  // total number of times officer sent to A
let sent_to_b = 0;  // total number of times officer sent to B


class FeedbackLoopComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    // d3.select(node).attr("class", props.class);

    let crimeData = generateData(n_a, n_b, totalTrials);
    console.log(crimeData);

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr("id", props.id)
      .style('width', '100%')
      .style('height', '100%');

    const g = svg.append("g");

    // draw initial plot
    const dots = g.selectAll(".feedbackDot")
      .data(crimeData)
      .enter()
      .append("circle")
      .attr("class", "feedbackDot")
      .attr("r", r)
      .style("fill", "#353535")
      .attr("cx", width / 2)
      .attr("cy", height / 2);
      // .style("opacity", function(d) { return d.day === 0 ? 1 : 0; });

    simulation
      .nodes(crimeData)
      .on("tick", function(d) {
        dots.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
      });

    // let day = 0;
    // let t = d3.interval(function(elapsed) {
    //   // console.log(day, total_a, total_b);
    //   day++;

    //   if(day === totalTrials) {
    //     console.log(crimeData);
    //     console.log("Observed crimes in A:", n_a);
    //     console.log("Total actual crimes in A:", total_a);
    //     console.log("Observed crimes in B:", n_b);
    //     console.log("Total actual crimes in B:", total_b);
    //     console.log("Pct of time officer sent to A:", sent_to_a/totalTrials);
    //     console.log("Pct of time officer sent to B:", sent_to_b/totalTrials);
    //   }

    //   if(day > totalTrials) t.stop();
    // }, 250);

  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    // if (props.generateSample !== oldProps.generateSample) {  // only draw new sample when button is clicked, not if sample size slider is changed
    //   console.log("generate new sample!");
    //   var mean = generateSample(props.n);
    //   this.props.updateProps({
    //     sampleErrors: this.props.sampleErrors.concat([mean - 10000]),
    //     sampleMeans: this.props.sampleMeans.concat([mean])
    //   })
    // }
  }
}

function generateData(n_a, n_b, totalTrials) {
  let data = initializeData(n_a, n_b);
  for(let i = 1; i < totalTrials; i++) {
    let location = dispatchOfficer(n_a, n_b);
    location == "A" ? updateData(data, "A", i, lambda_a) : updateData(data, "B", i, lambda_b);
  }

  return data;
}

function initializeData(n_a, n_b) {
  let data = [];
  for(let i = 0; i < n_a + n_b; i++) {
    if(i < n_a) {
      data.push({"neighborhood": "A", "day": 0, "crime": 1});
    }
    else {
      data.push({"neighborhood": "B", "day": 0, "crime": 1});
    }
  }
  return data;
}

function dispatchOfficer(n_a, n_b) {
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

module.exports = FeedbackLoopComponent;
