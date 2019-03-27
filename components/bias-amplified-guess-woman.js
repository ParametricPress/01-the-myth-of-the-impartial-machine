/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const PCTFORMAT = d3.format('.0%');

const size = 400;
const margin = 20;
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const xPos = d3.scaleLinear()
  .domain([1, 5])
  .range([margin, (size/2) - margin]);

class BiasAmplifiedGuessWomanComponent extends D3Component {

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
      .style('height', 'auto');

    const g = svg.append('g')
      .attr('transform', 'translate(0,' + margin + ')');

    const dataCircles = this.dataCircles = g.selectAll('.dataPoint')
      .data(ids)
      .enter()
      .append('circle')
      .attr('class', function(d, i) { return d <= props.bias * 10 ? 'dataPoint woman' : 'dataPoint man incorrect'; })
      .attr('r', 2)
      .attr('cx', function(d, i) { return d % 5 === 0 ? xPos(5) : xPos(d % 5); })
      .attr('cy', function(d, i) { return d <= 5 ? 10 : 20});

    // add labels for woman and man
    svg.append('text')
      .attr('class', 'genderLabel')
      .attr('x', size / 4 + margin)
      .attr('y', 16)
      .text('Woman');

    svg.append('text')
      .attr('class', 'genderLabel')
      .attr('x', size * 0.75 + margin)
      .attr('y', 16)
      .text('Man');

    // add error rate label
    this.errorLabel = svg.append('text')
      .attr('class', 'errorLabel')
      .attr('x', size / 2)
      .attr('y', 60)
      .text('Error: ' + PCTFORMAT(1 - props.bias));
  }


  update(props, oldProps) {
    if (props.bias !== oldProps.bias) {
      this.dataCircles.attr('class', function(d, i) { return d <= props.bias * 10 ? 'dataPoint woman' : 'dataPoint man incorrect'; });

      this.errorLabel.text('Error: ' + PCTFORMAT(1 - props.bias));
    }
  }
}

module.exports = BiasAmplifiedGuessWomanComponent;
