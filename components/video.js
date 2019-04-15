const React = require('react');


const getExtension = (str) => {
  return str.substr(str.lastIndexOf('.') + 1);
}

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        this.props.updateProps({ value: e.target.value });
    }
    render() {
        const { hasError, idyll, updateProps, ...props } = this.props;
        return (
            <video controls={true} width={props.width} height={props.height}>
              {
                props.files.map((file) => {
                  return <source key={file} src={file} type={`video/${getExtension(file)}`} />
                })
              }
              Your browser doesn't support embedded videos.
          </video>
        );
    }
}

module.exports = Video;
