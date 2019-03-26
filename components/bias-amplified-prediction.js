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
const margin = 16;
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const ids_incorrect;

const xPos = d3.scaleLinear()
  .domain([1, 5])
  .range([0, (size - margin)/2]);

class BiasAmplifiedPredictionComponent extends D3Component {

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
      .attr('transform', 'translate(' + margin + ',' + margin + ')');

    let incorrectIds = chooseIncorrectPreds(props.modelAccuracy);

    const dataCircles = this.dataCircles = g.selectAll('.dataPoint')
      .data(ids)
      .enter()
      .append('circle')
      .attr('class', function(d, i) { return determineClasses(d, props.bias, incorrectIds); })
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
      .text('Error: ' + PCTFORMAT(1 - props.modelAccuracy));
  }


  update(props, oldProps) {
    if (props !== oldProps.bias) {
      let ids_incorrect = chooseIncorrectPreds(props.modelAccuracy);
      this.dataCircles.attr('class', function(d, i) { return determineClasses(d, props.bias, ids_incorrect); });
      this.errorLabel.text('Error: ' + PCTFORMAT(1 - props.modelAccuracy));
    }
  }
}

function chooseIncorrectPreds(modelAccuracy) {
  let ids_incorrect = [];
  const numIncorrect = Math.round(10 * (1-modelAccuracy));

  while(ids_incorrect.length < numIncorrect) {
    let i = 10 - Math.floor(Math.random() * 5); // choose incorrect IDs from 6-10
    if(ids_incorrect.indexOf(i) === -1) {  // make sure we don't sample same ID more than once
      ids_incorrect.push(i);
    }
  }

  return ids_incorrect;
}

function determineClasses(id, bias, incorrectIdsArray) {
  let classString = 'dataPoint id_' + id;

  if(id <= bias * 10) { classString += ' woman'; }
  else { classString += ' man'; }

  if(incorrectIdsArray.indexOf(id) > -1) { classString += ' incorrect'; }
  else { classString += ' correct'; }

  return classString;
}

module.exports = BiasAmplifiedPredictionComponent;
