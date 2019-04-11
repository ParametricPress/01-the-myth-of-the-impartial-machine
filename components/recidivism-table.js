const React = require('react');

const accuracy = 0.666;

class RecidivismTable extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
          totalSampleSize: 100,
          totalNoReoffense: 70,
          totalReoffense: 30,
          totalHighRisk: 30,
          highRiskNoReoffense: 10,
          highRiskReoffense: 20
        }
    }

    onChange(e) {
      const newValue = +e.target.value;
      // do some error handling here

      this.setState({
        totalHighRisk: newValue,
        highRiskNoReoffense: Math.round(accuracy * newValue),
        highRiskReoffense: Math.round((1 - accuracy) * newValue),
      })
    }

    render() {
        const { hasError, idyll, updateProps, ...props } = this.props;
        const { totalSampleSize, totalNoReoffense, totalReoffense, totalHighRisk, highRiskNoReoffense, highRiskReoffense } = this.state;
        return (
          <div className="recidivism-tables">
            <div className = "recidivism-table groupA">
              <div>Model Prediction</div>
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
                    <td>{totalNoReoffense - highRiskNoReoffense}</td>
                    <td>{highRiskNoReoffense}</td>
                    <td>{totalNoReoffense}</td>
                  </tr>
                  <tr>
                    <td>Reoffends</td>
                    <td>{totalReoffense - highRiskReoffense}</td>
                    <td>{highRiskReoffense}</td>
                    <td>{totalReoffense}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{totalSampleSize - totalHighRisk}</td>
                    <td><input type="text" autoComplete="off" value={totalHighRisk} onChange={this.onChange} /> </td>
                    <td>{totalSampleSize}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className = "recidivism-table groupB">
              <div>Model Prediction</div>
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
                    <td>20</td>
                    <td>20</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td>Reoffends</td>
                    <td>20</td>
                    <td>40</td>
                    <td>60</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>40</td>
                    <td>60</td>
                    <td>100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
    }
}

module.exports = RecidivismTable;
