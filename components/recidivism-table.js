const React = require('react');


class RecidivismTable extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
          lowRiskNoReoffense: 20,
          highRiskNoReoffense: 20,
          lowRiskReoffense: 20,
          highRiskReoffense: 40
        }
    }

    onChange(e) {
      const newValue = +e.target.value;
      this.setState({
        highRiskNoReoffense: Math.round(0.33 * newValue),
        highRiskReoffense: Math.round(0.666 * newValue)
      })
    }

    render() {
        const { hasError, idyll, updateProps, ...props } = this.props;
        const { lowRiskNoReoffense, lowRiskReoffense, highRiskNoReoffense, highRiskReoffense } = this.state;
        return (
          <div className="recidivism-table">
            <div>Model Prediction</div>
            <table>
              <tr>
                <td></td>
                <td>Low Risk</td>
                <td>High Risk</td>
                <td>Total</td>
              </tr>
              <tr>
                <td>Doesn't Reoffend</td>
                <td>{lowRiskNoReoffense}</td>
                <td>{highRiskNoReoffense}</td>
                <td>{lowRiskNoReoffense + highRiskNoReoffense}</td>
              </tr>
              <tr>
                <td>Reoffends</td>
                <td>{lowRiskReoffense}</td>
                <td>{highRiskReoffense}</td>
                <td>{lowRiskReoffense + highRiskReoffense}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{lowRiskReoffense + lowRiskNoReoffense}</td>
                <td><input type="text" value={highRiskReoffense + highRiskNoReoffense} onChange={this.onChange} /> </td>
                <td>{lowRiskReoffense + highRiskReoffense + lowRiskNoReoffense + highRiskNoReoffense}</td>
              </tr>
            </table>
          </div>
        );
    }
}

module.exports = RecidivismTable;
