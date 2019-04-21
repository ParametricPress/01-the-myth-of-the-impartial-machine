const React = require('react');


const getExtension = (str) => {
  return str.substr(str.lastIndexOf('.') + 1);
}

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
          playing: false
        }
    }
    onChange(e) {
        this.props.updateProps({ value: e.target.value });
    }

    togglePlay() {
      if (this.state.playing) {
        this.ref.pause();
      } else {
        this.ref.play();
      }
      this.setState({
        playing: !this.state.playing
      });
    }

    handleRef(_ref) {
      if (!_ref) return;
      this.ref = _ref;
      this.ref.onended = this.handleEnd.bind(this);
    }

    handleEnd() {
      this.setState({
        playing: false
      })
    }

    render() {
        const { hasError, idyll, updateProps, ...props } = this.props;
        return (
          <div style={{position: 'relative'}}>
            <video ref={(_ref) => this.handleRef(_ref)} controls={false} width={props.width} height={props.height}>
              {
                props.files.map((file) => {
                  return <source key={file} src={file} type={`video/${getExtension(file)}`} />
                })
              }
              Your browser doesn't support embedded videos.
            </video>
            {
              !this.state.playing ?
                <div onClick={this.togglePlay.bind(this)} style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', cursor: 'pointer'}}>
                  <img src="static/images/play-button.png" />
                </div> : null
            }
          </div>
        );
    }
}

module.exports = Video;
