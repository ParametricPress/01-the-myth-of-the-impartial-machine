const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 400;
const height = 400;
const margin = {top: 20, right: 0, bottom: 0, left: 0};
const DOLLARFORMAT = d3.format("$,.0f");

const data = [
  {id: 11, income: 6000},
  {id: 12, income: 7000},
  {id: 13, income: 7000},
  {id: 14, income: 8000},
  {id: 15, income: 6000},
  {id: 6, income: 5000},
  {id: 7, income: 5000},
  {id: 8, income: 5000},
  {id: 9, income: 5000},
  {id: 10, income: 6000},
  {id: 16, income: 8000},
  {id: 17, income: 8000},
  {id: 18, income: 9000},
  {id: 19, income: 9000},
  {id: 20, income: 9000},
  {id: 21, income: 9000},
  {id: 22, income: 9000},
  {id: 23, income: 9000},
  {id: 24, income: 9000},
  {id: 25, income: 10000},
  {id: 26, income: 10000},
  {id: 27, income: 10000},
  {id: 28, income: 10000},
  {id: 29, income: 10000},
  {id: 30, income: 10000},
  {id: 31, income: 10000},
  {id: 32, income: 11000},
  {id: 33, income: 11000},
  {id: 34, income: 11000},
  {id: 35, income: 11000},
  {id: 36, income: 11000},
  {id: 37, income: 11000},
  {id: 38, income: 12000},
  {id: 39, income: 12000},
  {id: 40, income: 12000},
  {id: 50, income: 50000},
  {id: 41, income: 12000},
  {id: 42, income: 12000},
  {id: 43, income: 12000},
  {id: 44, income: 12000},
  {id: 45, income: 12000},
  {id: 46, income: 12000},
  {id: 47, income: 12000},
  {id: 1, income: 5000},
  {id: 2, income: 5000},
  {id: 3, income: 5000},
  {id: 4, income: 5000},
  {id: 5, income: 5000},
  {id: 48, income: 15000},
  {id: 49, income: 15000}
];

const rScale = d3.scaleSqrt()
  .domain([d3.min(data, function(d) { return d.income; }), d3.max(data, function(d) { return d.income; })])
  .range([5, 50]);


const colorScale = d3.scaleLog()
.domain([d3.min(data, function(d) { return d.income; }), d3.max(data, function(d) { return d.income; })])
.range(['#fff', '#DACDFF']);

const simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width/2, height/2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(1).radius(function(d) { return rScale(d.income) + 2; }).iterations(5)); // Force that avoids circle overlapping

class SamplingErrorSampleComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    d3.select(node).attr("class", props.class);

    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr("id", props.id)
      .style('width', '100%')
      .style('height', '100%');

    const dots = svg.append("g")
      // .attr("transform", "translate(0," + margin.top + ")")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function(d) { return "incomeCircle notSampled income_" + d.id; })
      .attr("fill", function(d) { return colorScale(d.income); })
      .attr("opacity", 0)
      // .attr("r", 10)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", function(d) { return rScale(d.income); });

    simulation
      .nodes(data)
      .on("tick", function(d) {
        dots.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
    });

    dots
      .attr('r', 0)
      .attr('opacity', 1)
      .transition()
      .attr("r", function(d) { return rScale(d.income); });

    // const meanIncome = calculateMean(data);

    // const meanLabel = svg.append("text")
    //   .attr("class", "meanLabel")
    //   .attr("x", width / 2)
    //   .attr("y", margin.top)
    //   .text("Sample mean:");
  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    if (props.generateSample !== oldProps.generateSample) {  // only draw new sample when button is clicked, not if sample size slider is changed
      console.log("generate new sample!");
      var mean = generateSample(props.n);
      this.props.updateProps({
        sampleErrors: this.props.sampleErrors.concat([mean - 10000]),
        sampleMeans: this.props.sampleMeans.concat([mean])
      })
    }
  }
}

function generateSample(sampleSize) {
  d3.selectAll("#samplePlot .incomeCircle").classed("notSampled", true);

  var sampleIDs = [];
  var sampleData = [];
  var maxID = d3.max(data, function(d) { return d.id; });

  while(sampleIDs.length < sampleSize) {
    var i = Math.floor(Math.random() * maxID) + 1;
    if(sampleIDs.indexOf(i) === -1) {  // make sure we don't sample same ID more than once
      sampleIDs.push(i);

      d3.select(".income_" + i).classed("notSampled", false);
      sampleData.push(d3.select(".income_" + i).datum());
    }
  }
  // console.log(sampleIDs);

  // update sample mean
  var sampleMean = calculateMean(sampleData);
  // d3.select("#samplePlot .meanLabel").text("Sample mean: " + DOLLARFORMAT(sampleMean));
  return sampleMean;
}

function calculateMean(data) {
  var initialValue = 0;
  var sum = data.reduce(function(accumulator, currentValue) {
    return accumulator + currentValue.income;
  }, initialValue);

  return sum/data.length;
}

module.exports = SamplingErrorSampleComponent;
