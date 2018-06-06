import React from 'react';
import Hammer from 'hammerjs';
import PropTypes from 'prop-types';

class ConfigurableGridItemEditorSizeControl extends React.Component {

  componentDidMount() {
    this.hammer = new Hammer(this.controlRef.current, {
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]],
    });

    this.hammer.on('pan', ev => {
      this.props.setResizeActive(true);
      if (this.props.position === 'topLeft') {
        this.setHorizontal(ev.deltaX);
        this.setVertical(ev.deltaY);
      } else if (this.props.position === 'top') {
        this.setVertical(ev.deltaY);
      } else if (this.props.position === 'topRight') {
        this.setHorizontal(0 - ev.deltaX);
        this.setVertical(ev.deltaY);
      } else if (this.props.position === 'left') {
        this.setHorizontal(ev.deltaX);
      } else if (this.props.position === 'center') {
        this.setHorizontal(ev.deltaX);
        this.setVertical(ev.deltaY);
      } else if (this.props.position === 'right') {
        this.setHorizontal(0 - ev.deltaX);
      } else if (this.props.position === 'bottomLeft') {
        this.setHorizontal(ev.deltaX);
        this.setVertical(0 - ev.deltaY);
      } else if (this.props.position === 'bottom') {
        this.setVertical(0 - ev.deltaY);
      } else if (this.props.position === 'bottomRight') {
        this.setHorizontal(0 - ev.deltaX);
        this.setVertical(0 - ev.deltaY);
      }
    });
    this.hammer.on('panend pancancel', () => {
      this.props.setResizeActive(false);
      this.setHorizontal(0);
      this.setVertical(0);
    });
  }

  setHorizontal = value => {
    if (this.props.horizontal !== undefined) {
      this.props.horizontal(value);
    }
  };

  setVertical = value => {
    if (this.props.vertical !== undefined) {
      this.props.vertical(value);
    }
  };

  controlRef = React.createRef();

  render() {
    return (
      <div
        className={`ConfigurableGridItemEditorSizeControl ConfigurableGridItemEditorSizeControl_${
          this.props.position
        }`}
        ref={this.controlRef}
      />
    );
  }
}

ConfigurableGridItemEditorSizeControl.propTypes = {
  position: PropTypes.string.isRequired,
  horizontal: PropTypes.func,
  vertical: PropTypes.func,
  setResizeActive: PropTypes.func.isRequired,
};

ConfigurableGridItemEditorSizeControl.defaultProps = {
  horizontal: () => {},
  vertical: () => {},
};


export default ConfigurableGridItemEditorSizeControl;
