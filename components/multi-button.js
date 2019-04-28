import React from 'react';
const ReactDOM = require('react-dom');

class MultiButton extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleClick(value) {
    this.props.updateProps({
      value: value,
      reset: 0
    });
  }

  render() {
    const {
      idyll,
      hasError,
      updateProps,
      options,
      value,
      ...props
    } = this.props;

    return (
      <div className="parametric-multi-button-container">
        {options.map(d => {
          const optValue = typeof d === 'object' ? d.value : d;
          const label = typeof d === 'object' ? (d.label || d.value) : d;
          return (
            <button
              key={optValue}
              className={`parametric-multi-button ${optValue === value ? 'selected' : ''}`}
              onClick={() => this.handleClick(optValue)}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }
}

export default MultiButton;
