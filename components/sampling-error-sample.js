const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 400;
const height = 400;
const margin = {top: 20, right: 0, bottom: 0, left: 0};

const data = [
  {id: 11, income: 8000},
  {id: 12, income: 8000},
  {id: 13, income: 8000},
  {id: 14, income: 8000},
  {id: 15, income: 8500},
  {id: 6, income: 6000},
  {id: 7, income: 6000},
  {id: 8, income: 6200},
  {id: 9, income: 6300},
  {id: 10, income: 6500},
  {id: 16, income: 8500},
  {id: 17, income: 8500},
  {id: 18, income: 9000},
  {id: 19, income: 9000},
  {id: 20, income: 9000},
  {id: 21, income: 9000},
  {id: 22, income: 9000},
  {id: 23, income: 9500},
  {id: 24, income: 9500},
  {id: 25, income: 10000},
  {id: 26, income: 10000},
  {id: 27, income: 10000},
  {id: 28, income: 10000},
  {id: 29, income: 10500},
  {id: 30, income: 10500},
  {id: 31, income: 10500},
  {id: 32, income: 11000},
  {id: 33, income: 11000},
  {id: 34, income: 11000},
  {id: 35, income: 11000},
  {id: 36, income: 11500},
  {id: 37, income: 11500},
  {id: 38, income: 12000},
  {id: 39, income: 12000},
  {id: 40, income: 12000},
  {id: 50, income: 50000},
  {id: 41, income: 14000},
  {id: 42, income: 14000},
  {id: 43, income: 14500},
  {id: 44, income: 14500},
  {id: 45, income: 15000},
  {id: 46, income: 16000},
  {id: 47, income: 16000},
  {id: 1, income: 5000},
  {id: 2, income: 5000},
  {id: 3, income: 5200},
  {id: 4, income: 5500},
  {id: 5, income: 5500},
  {id: 48, income: 16000},
  {id: 49, income: 18000}
];

const rScale = d3.scaleSqrt()
  .domain([d3.min(data, function(d) { return d.income; }), d3.max(data, function(d) { return d.income; })])
  .range([5, 50]);

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
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr("id", props.id)
      .style('width', '50%')
      .style('height', 'auto');

    const dots = svg.append("g")
      // .attr("transform", "translate(0," + margin.top + ")")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "incomeCircle notSampled")
      .attr("r", function(d) { return rScale(d.income); })
      // .attr("r", 10)
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    simulation
      .nodes(data)
      .on("tick", function(d) {
        dots.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
    });

    const meanIncome = calculateMean(data);

    const meanLabel = svg.append("text")
      .attr("class", "meanLabel")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text("Sample mean:");
  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    // Example of how to update based on new props
    if (props.r !== oldProps) {
      // this.circle.attr('r', props.r)
    }
    if (props.generateSample !== oldProps) {
      console.log("generate new sample!");
      generateSample(props.n);
    }
  }
}

function generateSample(sampleSize) {
  // generate list of randomly selected ID numbers

  // select circles matching those ID numbers
}

function calculateMean(data) {
  var initialValue = 0;
  var sum = data.reduce(function(accumulator, currentValue) {
    return accumulator + currentValue.income;
  }, initialValue);

  return sum/data.length;
}

module.exports = SamplingErrorSampleComponent;
