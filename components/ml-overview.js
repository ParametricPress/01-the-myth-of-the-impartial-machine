/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 300;

class MLOverviewComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto');

    this.circle = svg.append('circle')
      .attr('r', props.r)
      .attr('cx', size / 2)
      .attr('cy', size / 2);
  }

  /**
   * This function gets called whenever a component
   * passed into the property changes, e.g. by a user
   * interacting with something on the page.
   */
  update(props, oldProps) {

    // Example of how to update based on new props
    if (props.r !== oldProps) {
      this.circle.attr('r', props.r)
    }
  }
}

module.exports = MLOverviewComponent;
