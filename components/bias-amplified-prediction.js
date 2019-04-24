/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const PCTFORMAT = d3.format('.0%');

const height = 100;
const width = height * 2;
const margin = 25;
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let pred_woman_ids;
let pred_man_ids;

// const ids_incorrect;

const xPosWoman = d3.scaleLinear()
  .domain([1, 5])
  .range([margin, (width/2) - margin]);

const xPosMan = d3.scaleLinear()
  .domain([1, 5])
  .range([(width/2) + margin, width - margin]);

class BiasAmplifiedPredictionComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${width} ${height - 50}`)
      .attr('id', props.id)
      .style('width', '100%')
      .style('height', 'auto');

    const g = svg.append('g');
      // .attr('transform', 'translate(0,' + margin + ')');

    let incorrectIds = chooseIncorrectPreds(props.modelAccuracy);
    determinePositions(props.bias, incorrectIds);

    const dataCircles = this.dataCircles = g.selectAll('.dataPoint')
      .data(ids)
      .enter()
      .append('circle')
      .attr('class', function(d, i) { return determineClasses(d, props.bias, incorrectIds); })
      .attr('r', 3)
      .attr('cx', function(d, i) { if(pred_woman_ids.indexOf(d) > -1) return (pred_woman_ids.indexOf(d) + 1) % 5 === 0 ? xPosWoman(5) : xPosWoman((pred_woman_ids.indexOf(d) + 1) % 5);
                                   else return (pred_man_ids.indexOf(d) + 1) % 5 === 0 ? xPosMan(5) : xPosMan((pred_man_ids.indexOf(d) + 1) % 5);
                                 })
      .attr('cy', function(d, i) { return d <= 5 || pred_man_ids.indexOf(d) > -1 ? 20 : 30});

    // add labels for woman and man
    svg.append('text')
      .attr('class', 'genderLabel')
      .attr('x', width * 0.25)
      .attr('y', 8)
      .text('Woman');

    svg.append('text')
      .attr('class', 'genderLabel')
      .attr('x', width * 0.75)
      .attr('y', 8)
      .text('Man');

    // add error rate label
    this.errorLabel = svg.append('text')
      .attr('class', 'errorLabel')
      .attr('x', width / 2)
      .attr('y', 50)
      .text('Error: ' + PCTFORMAT(1 - props.modelAccuracy));

    props.modelAccuracy >= props.bias && d3.select("#biasAmplifiedConclusion span").text("not");
  }


  update(props, oldProps) {
    if (props !== oldProps.bias) {
      let incorrectIds = chooseIncorrectPreds(props.modelAccuracy);
      determinePositions(props.bias, incorrectIds);
      this.dataCircles.attr('class', function(d, i) { return determineClasses(d, props.bias, incorrectIds)})
        .attr('cx', function(d, i) { if(pred_woman_ids.indexOf(d) > -1) return (pred_woman_ids.indexOf(d) + 1) % 5 === 0 ? xPosWoman(5) : xPosWoman((pred_woman_ids.indexOf(d) + 1) % 5);
                                     else return (pred_man_ids.indexOf(d) + 1) % 5 === 0 ? xPosMan(5) : xPosMan((pred_man_ids.indexOf(d) + 1) % 5);
                                   })
        .attr('cy', function(d, i) { return d <= 5 || pred_man_ids.indexOf(d) > -1 ? 20 : 30});

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

function determinePositions(bias, incorrectIds) {
  pred_man_ids = [];
  pred_woman_ids = [];

  ids.forEach(function(d) {
    if(d <= 5) {
      pred_woman_ids.push(d);
    }
    else if (d > 5) {
      // if id correctly predicted as "woman", assign to woman ids
      if(d <= bias * 10 && incorrectIds.indexOf(d) === -1) pred_woman_ids.push(d);

      // if id correctly predicted as "man", assign to man ids
      else if(d > bias * 10 && incorrectIds.indexOf(d) === -1) pred_man_ids.push(d);

      // if id incorrectly predicted as "woman", assign to woman ids
      else if(d > bias * 10 && incorrectIds.indexOf(d) > -1) pred_woman_ids.push(d);

      // if id incorrectly predicted as "man", assign to man ids
      else if(d <= bias * 10 && incorrectIds.indexOf(d) > -1) pred_man_ids.push(d);
    }
  });

  console.log("Woman ids:", pred_woman_ids);
  console.log("Man ids:", pred_man_ids);
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
