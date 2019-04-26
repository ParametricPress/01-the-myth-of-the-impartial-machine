const React = require('react');

class BiasDataLabel extends React.Component {

  componentDidCatch(e) {
    console.log(e);
  }
  render() {
    const { hasError, updateProps, children, ...props } = this.props;
    return (
      <span>
        (<svg width={10} height={10}><circle r="5" cx="5" cy="5" fill="#539987" /></svg> = woman, <svg width={10} height={10}><circle r="5" cx="5" cy="5" fill="#d2d2d2" /></svg> = man)
      </span>
    );
  }
}

module.exports = BiasDataLabel;