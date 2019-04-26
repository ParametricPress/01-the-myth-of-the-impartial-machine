const React = require('react');

class BiasIncorrectPredLabel extends React.Component {

  componentDidCatch(e) {
    console.log(e);
  }
  render() {
    const { hasError, updateProps, children, ...props } = this.props;
    return (
      <span>
        (<svg width={31} height={15}><circle r="6" cx="7" cy="8" stroke="#539987" strokeWidth="2" fill="none" /><circle r="6" cx="24" cy="8" stroke="#d2d2d2" strokeWidth="2" fill="none" /></svg> = incorrect prediction)
      </span>
    );
  }
}

module.exports = BiasIncorrectPredLabel;