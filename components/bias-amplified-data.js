/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 100;
const margin = 25;
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const xPos = d3.scaleLinear()
  .domain([1, 5])
  .range([margin, size - margin]);

class BiasAmplifiedDataComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .attr('id', props.id)
      .style('width', '100%')
      .style('height', '100%');

    const g = svg.append('g');
      // .attr('transform', 'translate(0,' + margin + ')');

    const dataCircles = this.dataCircles = g.selectAll('.dataPoint')
      .data(ids)
      .enter()
      .append('circle')
      .attr('class', function(d, i) { return d <= props.bias * 10 ? 'dataPoint woman' : 'dataPoint man'; })
      .attr('r', 3)
      .attr('cx', function(d, i) { return d % 5 === 0 ? xPos(5) : xPos(d % 5); })
      .attr('cy', function(d, i) { return d <= 5 ? 20 : 30});
  }


  update(props, oldProps) {

    // Example of how to update based on new props
    if (props.bias !== oldProps.bias) {
        this.dataCircles.attr('class', function(d, i) { return d <= props.bias * 10 ? 'dataPoint woman' : 'dataPoint man'; });
    }
  }
}

module.exports = BiasAmplifiedDataComponent;
