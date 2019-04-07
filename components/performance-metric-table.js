/**
 * Basic boilerplate for a D3-based component.
 * If you want to make a new component, make a copy of
 * this file and rename it.
 */

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

// const height = 100;
// const width = height * 2;
// const margin = 25;

const sampleSize = 100;
let accuracy = (2/3);

class PerformanceMetricTableComponent extends D3Component {

  /**
   * This function gets called when the component is
   * initially drawn to the screen. It only gets called
   * once on the initial pageload.
   */
  initialize(node, props) {
    const table = this.table = d3.select(node).append('table');
    table.attr('id', props.id);

    let totalLR = sampleSize - props.totalHighRisk;

    // set up table structure
    const predictionLabelRow = table.append("tr");
    const headerRow = table.append("tr");
    const notRearrestedRow = table.append("tr").attr("class", "notRearrested");
    const rearrestedRow = table.append("tr").attr("class", "rearrested");
    const totalPredsRow = table.append("tr").attr("class", "total");

    predictionLabelRow.append("th");
    predictionLabelRow.append("th").attr("colspan", 2).text("Prediction");
    predictionLabelRow.append("th");

    notRearrestedRow.append("th").attr("scope", "row").text("Not Rearrested");
    const notRearrestedLRCell = notRearrestedRow.append("td").attr("class", "notRearrested lowRisk");
    const notRearrestedHRCell = notRearrestedRow.append("td").attr("class", "notRearrested highRisk");
    const notRearrestedTotalCell = notRearrestedRow.append("td").attr("class", "notRearrested total");

    rearrestedRow.append("th").attr("scope", "row").text("Rearrested");
    const rearrestedLRCell = rearrestedRow.append("td").attr("class", "rearrested lowRisk");
    const rearrestedHRCell = rearrestedRow.append("td").attr("class", "rearrested highRisk");
    const rearrestedTotalCell = rearrestedRow.append("td").attr("class", "rearrested total");

    totalPredsRow.append("th").attr("scope", "row").text("Total");
    const totalLRCell = totalPredsRow.append("td").attr("class", "total lowRisk");
    const totalHRCell = totalPredsRow.append("td").attr("class", "total highRisk");
    const totalSampleSizeCell = totalPredsRow.append("td").attr("class", "total");

    // populate cells
    headerRow.append("th").attr("scope", "col").text("");
    headerRow.append("th").attr("scope", "col").text("Low Risk");
    headerRow.append("th").attr("scope", "col").text("High Risk");
    headerRow.append("th").attr("scope", "col").text("Total");

    notRearrestedLRCell.text(props.totalNotRearrested - Math.round((props.totalHighRisk * (1 - accuracy))));  // cell 1
    notRearrestedHRCell.text(Math.round(props.totalHighRisk * (1 - accuracy)));  // cell 2
    notRearrestedTotalCell.text(props.totalNotRearrested);  // cell 5

    rearrestedLRCell.text(props.totalRearrested - Math.round((props.totalHighRisk * accuracy)));  // cell 3
    rearrestedHRCell.text(Math.round(props.totalHighRisk * accuracy));  // cell 4
    rearrestedTotalCell.text(props.totalRearrested);  // cell 6

    totalLRCell.text(totalLR);  // cell 7
    totalHRCell.text(props.totalHighRisk);  // cell 8
    totalSampleSizeCell.text(sampleSize);  // cell 9
  }


  update(props, oldProps) {
    // if (props !== oldProps.bias) {
    //   let incorrectIds = chooseIncorrectPreds(props.modelAccuracy);
    //   determinePositions(props.bias, incorrectIds);
    //   this.dataCircles.attr('class', function(d, i) { return determineClasses(d, props.bias, incorrectIds)})
    //     .attr('cx', function(d, i) { if(pred_woman_ids.indexOf(d) > -1) return (pred_woman_ids.indexOf(d) + 1) % 5 === 0 ? xPosWoman(5) : xPosWoman((pred_woman_ids.indexOf(d) + 1) % 5);
    //                                  else return (pred_man_ids.indexOf(d) + 1) % 5 === 0 ? xPosMan(5) : xPosMan((pred_man_ids.indexOf(d) + 1) % 5);
    //                                })
    //     .attr('cy', function(d, i) { return d <= 5 || pred_man_ids.indexOf(d) > -1 ? 20 : 30});

    //   this.errorLabel.text('Error: ' + PCTFORMAT(1 - props.modelAccuracy));

    //   props.modelAccuracy >= props.bias ? d3.select("#biasAmplifiedConclusion span").text("not") : d3.select("#biasAmplifiedConclusion span").text("");
    // }
  }
}

module.exports = PerformanceMetricTableComponent;
