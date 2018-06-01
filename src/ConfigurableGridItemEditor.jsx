import React from 'react';
import ConfigurableGridItemEditorSizeControl from './ConfigurableGridItemEditorSizeControl';

// Probaly a better way of doing this
const closestArrayIndex = (array, target) => array.indexOf(array.reduce(function(prev, curr) {
  return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
}));

class ConfigurableGridItemEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      innerTop: 0,
      innerRight: 0,
      innerBottom: 0,
      innerLeft: 0,
      xPos: 0,
      yPos: 0,
      resizeActive: false,
    };
  }
  setColStart = value => {
    this.props.updateGridItemProperty(this.props.index, 'colStart', value);
  }
  setColEnd = value => {
    this.props.updateGridItemProperty(this.props.index, 'colEnd', value);
  }
  setRowStart = value => {
    this.props.updateGridItemProperty(this.props.index, 'rowStart', value);
  }
  setRowEnd = value => {
    this.props.updateGridItemProperty(this.props.index, 'rowEnd', value);
  }
  setInnerTop = value => {    const edgePosition = this.containerDiv.offsetTop + value;
    const rowStart = closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (rowStart !== this.props.rowStart) {
      this.props.updateGridItemProperty(this.props.index, 'rowStart', rowStart);
    }
    this.setState({innerTop: value});
  }
  setInnerRight = value => {
    const edgePosition = this.containerDiv.offsetLeft + this.containerDiv.offsetWidth - value;
    const colEnd = closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (colEnd !== this.props.colEnd) {
      this.props.updateGridItemProperty(this.props.index, 'colEnd', colEnd);
    }
    this.setState({innerRight: value});
  }
  setInnerBottom = value => {
    const edgePosition = this.containerDiv.offsetTop + this.containerDiv.offsetHeight - value;
    const rowEnd = closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (rowEnd !== this.props.rowEnd) {
      this.props.updateGridItemProperty(this.props.index, 'rowEnd', rowEnd);
    }
    this.setState({innerBottom: value});
  }
  setInnerLeft = value => {
    const edgePosition = this.containerDiv.offsetLeft + value;
    const colStart = closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (colStart !== this.props.colStart) {
      this.props.updateGridItemProperty(this.props.index, 'colStart', colStart);
    }
    this.setState({innerLeft: value});
  }
  setXPos = value => {
    this.setState({xPos: value});
  }
  setYPos = value => {
    this.setState({yPos: value});
  }
  setResizeActive = value => {
    this.setState({resizeActive: value});
    if (value === false) {
      this.props.updateGridCache();
    }
  }
  render(){
    return(
      <div
        className="ConfigurableGridItemEditor"
        style={{
          gridColumn: `${this.props.colStart} / ${this.props.colEnd}`,
          gridRow: `${this.props.rowStart} / ${this.props.rowEnd}`,
          transform: `translateX(${this.state.xPos}px) translateY(${this.state.yPos}px) translateZ(0)`,
          WebkitTransform: `translateX(${this.state.xPos}px) translateY(${this.state.yPos}px) translateZ(0)`,
        }}
        ref={( el ) => { this.containerDiv = el; }}
      >
        <div
          className={`ConfigurableGridItemEditor_inner${this.state.resizeActive ? ' ConfigurableGridItemEditor_inner-active' : ''}`}
          style={{
            top: `${this.state.innerTop}px`,
            right: `${this.state.innerRight}px`,
            bottom: `${this.state.innerBottom}px`,
            left: `${this.state.innerLeft}px`,
          }}
        >
          <ConfigurableGridItemEditorSizeControl
            position="topLeft"
            horizontal={this.setInnerLeft}
            vertical={this.setInnerTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="top"
            vertical={this.setInnerTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="topRight"
            horizontal={this.setInnerRight}
            vertical={this.setInnerTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="left"
            horizontal={this.setInnerLeft}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="center"
            horizontal={this.setXPos}
            vertical={this.setYPos}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="right"
            horizontal={this.setInnerRight}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottomLeft"
            horizontal={this.setInnerLeft}
            vertical={this.setInnerBottom}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottom"
            vertical={this.setInnerBottom}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottomRight"
            horizontal={this.setInnerRight}
            vertical={this.setInnerBottom}
            setResizeActive={this.setResizeActive}
          />
        </div>
      </div>
    );
  }
}

export default ConfigurableGridItemEditor;
