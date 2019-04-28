const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const accuracy = 0.666;
const PCTFORMAT = d3.format(".0%");

const ratioEqual = (an, ad, bn, bd) => {
  if (ad === 0) {
    if (bd === 0) {
      return true;
    }
    if (bn / bd === 1) {
      return true;
    }
    return false;
  }

  return an / ad === bn / bd;
}

class RecidivismTable extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
          totalSampleSize: 100,
          totalNoReoffense_a: 70,
          totalReoffense_a: 30,
          totalHighRisk_a: 30,
          highRiskNoReoffense_a: 10,
          highRiskReoffense_a: 20,

          totalNoReoffense_b: 40,
          totalReoffense_b: 60,
          totalHighRisk_b: 60,
          highRiskNoReoffense_b: 20,
          highRiskReoffense_b: 40
        }
    }

    onChange(e) {
      const newValue = +e.target.value;
      // do some error handling here
      if(newValue < 0 || newValue > 45) {
        console.log("Error: invalid value");
        d3.select(".recidivism-tables .inputError").classed("hidden", false);
      }
      else {
        d3.select(".recidivism-tables .inputError").classed("hidden", true);
        this.setState({
          totalHighRisk_a: newValue,
          highRiskReoffense_a: Math.round(accuracy * newValue),
          highRiskNoReoffense_a: Math.round((1 - accuracy) * newValue),
        })
      }
    }

    render() {
        const { hasError, idyll, updateProps, ...props } = this.props;
        const { totalSampleSize, totalNoReoffense_a, totalReoffense_a, totalHighRisk_a, highRiskNoReoffense_a, highRiskReoffense_a, totalNoReoffense_b, totalReoffense_b, totalHighRisk_b, highRiskNoReoffense_b, highRiskReoffense_b } = this.state;
        return (
          <div className="recidivism-tables">
            <div className = "recidivism-table groupA">
              <div className="groupLabel">Group A</div>
              <div className="predictionLabel">Model Prediction</div>
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td>Low Risk</td>
                    <td>High Risk</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Doesn't Reoffend</td>
                    <td>{totalNoReoffense_a - highRiskNoReoffense_a}</td>
                    <td>{highRiskNoReoffense_a}</td>
                    <td>{totalNoReoffense_a}</td>
                  </tr>
                  <tr>
                    <td>Reoffends</td>
                    <td>{totalReoffense_a - highRiskReoffense_a}</td>
                    <td>{highRiskReoffense_a}</td>
                    <td>{totalReoffense_a}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{totalSampleSize - totalHighRisk_a}</td>
                    <td><input type="number" autoComplete="off" min="0" max="45" value={totalHighRisk_a} onChange={this.onChange} /> </td>
                    <td>{totalSampleSize}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className = "recidivism-table groupB">
              <div className="groupLabel">Group B</div>
              <div className="predictionLabel">Model Prediction</div>
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td>Low Risk</td>
                    <td>High Risk</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Doesn't Reoffend</td>
                    <td>{totalNoReoffense_b - highRiskNoReoffense_b}</td>
                    <td>{highRiskNoReoffense_b}</td>
                    <td>{totalNoReoffense_b}</td>
                  </tr>
                  <tr>
                    <td>Reoffends</td>
                    <td>{totalReoffense_b - highRiskReoffense_b}</td>
                    <td>{highRiskReoffense_b}</td>
                    <td>{totalReoffense_b}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{totalSampleSize - totalHighRisk_b}</td>
                    <td>{totalHighRisk_b}</td>
                    <td>{totalSampleSize}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className = "recidivism-table accuracyMetrics">
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td>Group A</td>
                    <td>Group B</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Accuracy:</td>
                    <td style={{ background: ratioEqual(highRiskReoffense_a, totalHighRisk_a, highRiskReoffense_b, totalHighRisk_b) ? '#539987' : undefined}}>
                      {totalHighRisk_a === 0 ? "100%" : PCTFORMAT(highRiskReoffense_a/totalHighRisk_a)}
                    </td>
                    <td style={{ background: ratioEqual(highRiskReoffense_a, totalHighRisk_a, highRiskReoffense_b, totalHighRisk_b) ? '#539987' : undefined}}>
                      {PCTFORMAT(highRiskReoffense_b/totalHighRisk_b)}
                    </td>
                  </tr>
                  <tr>
                    <td>False Positive Rate:</td>
                    <td style={{ background: ratioEqual(highRiskNoReoffense_a, totalNoReoffense_a, highRiskNoReoffense_b, totalNoReoffense_b) ? '#539987' : undefined}}>
                      {PCTFORMAT(highRiskNoReoffense_a/totalNoReoffense_a)}
                    </td>
                    <td style={{ background: ratioEqual(highRiskNoReoffense_a, totalNoReoffense_a, highRiskNoReoffense_b, totalNoReoffense_b) ? '#539987' : undefined}}>
                      {PCTFORMAT(highRiskNoReoffense_b/totalNoReoffense_b)}
                    </td>
                  </tr>
                  <tr>
                    <td>False Negative Rate:</td>
                    <td style={{ background: ratioEqual(totalReoffense_a - highRiskReoffense_a, totalReoffense_a, totalReoffense_b - highRiskReoffense_b, totalReoffense_b) ? '#539987' : undefined}}>
                      {PCTFORMAT((totalReoffense_a - highRiskReoffense_a)/totalReoffense_a)}
                    </td>
                    <td style={{ background: ratioEqual(totalReoffense_a - highRiskReoffense_a, totalReoffense_a, totalReoffense_b - highRiskReoffense_b, totalReoffense_b) ? '#539987' : undefined}}>
                      {PCTFORMAT((totalReoffense_b - highRiskReoffense_b)/totalReoffense_b)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="inputError hidden">Invalid entry: Please enter a number between 0 and 45.</div>
          </div>
        );
    }
}

module.exports = RecidivismTable;
