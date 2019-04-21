const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600;
const height = 400;
const margin = {top: 20, right: 10, bottom: 0, left: 10};

const r = 4;
const totalTrials = 10;

const xScale_a = d3.scaleLinear()
  .domain([1, 10])
  .range([margin.left, margin.left + 10*(r + 2)]);

const xScale_b = d3.scaleLinear()
  .domain([1, 10])
  .range([width/2 + margin.left, width/2 + margin.left + 10*(r + 2)]);


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
    // console.log(crimeData);

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr("id", props.id)
      .style('width', '100%')
      .style('height', '100%');

    // const g = svg.append("g");

    // // draw initial plot
    const dots_a = svg.append("g")
      .selectAll(".feedbackDot")
      .data(crimeData[0])
      .enter()
      .append("circle")
      .attr("class", "feedbackDot neighborhoodA")
      .attr("r", r)
      .style("fill", "#353535")
      .attr("cx", function(d, i) { return margin.left + (i % 10) * (r * 2 + 2); })
      .attr("cy", function(d, i) { return margin.top + Math.floor(i / 10) * (r * 2 + 2); })
      .style("opacity", function(d) { return d.day === 0 ? 1 : 0; });

    const dots_b = svg.append("g")
      .selectAll(".feedbackDot")
      .data(crimeData[1])
      .enter()
      .append("circle")
      .attr("class", "feedbackDot neighborhoodB")
      .attr("r", r)
      .style("fill", "#353535")
      .attr("cx", function(d, i) { return (width/2 + margin.left) + (i % 10) * (r * 2 + 2); })
      .attr("cy", function(d, i) { return margin.top + Math.floor(i / 10) * (r * 2 + 2); })
      .style("opacity", function(d) { return d.day === 0 ? 1 : 0; });

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
  let data_a = initializeData(n_a, "A");
  let data_b = initializeData(n_b, "B");
  for(let i = 1; i < totalTrials + 1; i++) {
    let location = dispatchOfficer(n_a, n_b);
    location == "A" ? updateData(data_a, "A", i, lambda_a) : updateData(data_b, "B", i, lambda_b);
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
