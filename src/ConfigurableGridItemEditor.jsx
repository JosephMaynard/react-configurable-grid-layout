import React from 'react';
import ConfigurableGridItemEditorSizeControl from './ConfigurableGridItemEditorSizeControl';

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
  setInnerTop = value => {
    this.setState({innerTop: value});
  }
  setInnerRight = value => {
    this.setState({innerRight: value});
  }
  setInnerBottom = value => {
    this.setState({innerBottom: value});
  }
  setInnerLeft = value => {
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
