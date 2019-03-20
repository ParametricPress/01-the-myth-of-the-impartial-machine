/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600;
const height = 200;
const margins = {top: 10, right: 0, bottom: 10, left: 150};

const PCTFORMAT = d3.format(".0%");

const data = [
  {variable: "Pct of world population", US: 0.04, China_India: 0.36, Rest_of_world: 0.6},
  {variable: "Pct of images", US: 0.45, China_India: 0.03, Rest_of_world: 0.52}
];

const xScale = d3.scaleLinear()
  .domain([0, 1])
  .rangeRound([0, width - margins.left - margins.right]);

const yScale = d3.scaleBand()
  .domain(["Pct of world population", "Pct of images"])
  .range([height - margins.top - margins.bottom, margins.bottom])
  .padding(0.1);

const colorScale = d3.scaleOrdinal()
  .domain(["US", "Rest_of_world", "China_India"])
  .range(["#000", "#d2d2d2", "#666"]);

const stack = d3.stack();
const keys = ["US", "Rest_of_world", "China_India"];

class NonSamplingErrorBarChartComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    const g = svg.append('g')
      .attr("transform", "translate(" + margins.left + ", " + margins.top + ")");

    const slices = g.selectAll('g')
      .data(stack.keys(keys)(data))
      .enter()
      .append('g')
      .attr("fill", function(d) { return colorScale(d.key); });

    slices.selectAll('rect')
      .data(function(d) { return d; })
      .enter()
      .append('rect')
      .attr('x', function(d) { return xScale(d[0]); })
      .attr('y', function(d) { return yScale(d.data.variable); })
      .attr('height', yScale.bandwidth())
      .attr('width', function(d) { return xScale(d[1]) - xScale(d[0]); });

    slices.selectAll('text')
      .data(function(d) { return d; })
      .enter()
      .append('text')
      .attr('class', 'barValueLabels')
      .attr('x', function(d) { return (xScale(d[1]) + xScale(d[0]))/2; })
      .attr('y', function(d) { return yScale(d.data.variable) + yScale.bandwidth()/2; })
      .text(function(d) { return PCTFORMAT(d[1] - d[0]); });

    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .call(wrap, margins.left - 10);

    console.log(stack.keys(keys)(data));
  }

}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

module.exports = NonSamplingErrorBarChartComponent;
