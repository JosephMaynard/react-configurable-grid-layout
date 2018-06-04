import React from 'react';
import ConfigurableGridItemEditorSizeControl from './ConfigurableGridItemEditorSizeControl';

const clamp = ( value, min, max ) => Math.min ( Math.max( min, value ), max );

// Probaly a better way of doing this
const closestArrayIndex = (array, target) =>
  array.indexOf(
    array.reduce(function(prev, curr) {
      return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    })
  );

class ConfigurableGridItemEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerTop: 0,
      innerRight: 0,
      innerBottom: 0,
      innerLeft: 0,
      xPos: 0,
      yPos: 0,
      resizeActive: false,
      currentRowStart: this.props.rowStart,
      currentColEnd: this.props.colEnd,
      currentRowEnd: this.props.rowEnd,
      currentColStart: this.props.colStart,
    };
  }
  resizeTop = value => {
    const innerTop = clamp(
      value,
      0 - this.containerDiv.offsetTop,
      this.containerDiv.offsetHeight - this.props.rowHeight
    );
    const edgePosition = this.containerDiv.offsetTop + innerTop;
    const rowStart =
      closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (rowStart !== this.state.currentRowStart) {
      this.props.updateGridItemProperty(this.props.index, 'rowStart', rowStart);
      this.setState(() => ({
        currentRowStart: rowStart,
        innerTop,
      }));
    } else {
      this.setState(() => ({ innerTop }));
    }
  };
  resizeRight = value => {
    const innerRight = clamp(
      value,
      0 -  (this.props.gridContainerWidth - this.containerDiv.offsetLeft - this.containerDiv.offsetWidth),
      this.containerDiv.offsetWidth - this.props.columnWidth
    );
    const edgePosition =
      this.containerDiv.offsetLeft + this.containerDiv.offsetWidth - innerRight;
    const colEnd = closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (colEnd !== this.state.currentColEnd) {
      this.props.updateGridItemProperty(this.props.index, 'colEnd', colEnd);
      this.setState(() => ({
        currentColEnd: colEnd,
        innerRight,
      }));
    } else {
      this.setState(() => ({ innerRight }));
    }
  };
  resizeBottom = value => {
    const innerBottom = clamp(
      value,
      0 -  (this.props.gridContainerHeight - this.containerDiv.offsetTop - this.containerDiv.offsetHeight),
      this.containerDiv.offsetHeight - this.props.rowHeight
    );
    const edgePosition =
      this.containerDiv.offsetTop + this.containerDiv.offsetHeight - innerBottom;
    const rowEnd =
      closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (rowEnd !== this.state.currentRowEnd) {
      this.props.updateGridItemProperty(this.props.index, 'rowEnd', rowEnd);
      this.setState(() => ({
        currentRowEnd: rowEnd,
        innerBottom,
      }));
    } else {
      this.setState(() => ({ innerBottom }));
    }
  };
  resizeLeft = value => {
    const innerLeft = clamp(
      value,
      0 - this.containerDiv.offsetLeft,
      this.containerDiv.offsetWidth - this.props.columnWidth
    );
    const edgePosition = this.containerDiv.offsetLeft + innerLeft;
    const colStart =
    closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (colStart !== this.state.currentColStart) {
      this.props.updateGridItemProperty(this.props.index, 'colStart', colStart);
      this.setState(() => ({
        currentColStart: colStart,
        innerLeft,
      }));
    } else {
      this.setState(() => ({ innerLeft }));
    }
  };
  setXPos = value => {
    const xPos = clamp(
      value,
      0 - this.containerDiv.offsetLeft,
      this.props.gridContainerWidth - this.containerDiv.offsetLeft - this.containerDiv.offsetWidth
    );
    const edgePosition = this.containerDiv.offsetLeft + xPos;
    const colStart =
    closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (colStart !== this.state.currentColStart) {
      const columSpan = this.props.colEnd - this.props.colStart
      this.props.updateGridItemProperty(this.props.index, 'colStart', colStart);
      this.props.updateGridItemProperty(this.props.index, 'colEnd', colStart + columSpan);
      this.setState((prevState) => ({
        currentColStart: colStart,
        currentColEnd: prevState.colStart + columSpan,
        xPos,
      }));
    } else {
      this.setState(() => ({ xPos }));
    }
  };
  setYPos = value => {
    const yPos = clamp(
      value,
      0 - this.containerDiv.offsetTop,
      this.props.gridContainerHeight - this.containerDiv.offsetTop - this.containerDiv.offsetHeight
    );
    const edgePosition = this.containerDiv.offsetTop + yPos;
    const rowStart =
    closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (rowStart !== this.state.currentRowStart) {
      const rowSpan = this.props.rowEnd - this.props.rowStart
      this.props.updateGridItemProperty(this.props.index, 'rowStart', rowStart);
      this.props.updateGridItemProperty(this.props.index, 'rowEnd', rowStart + rowSpan);
      this.setState((prevState) => ({
        currentRowStart: rowStart,
        currentRowEnd: prevState.rowStart + rowSpan,
        yPos,
      }));
    } else {
      this.setState(() => ({ yPos }));
    }
  };
  setResizeActive = value => {
    this.setState({ resizeActive: value });
    if (value === false) {
      this.props.updateGridCache();
    }
  };
  render() {
    return (
      <div
        className="ConfigurableGridItemEditor"
        style={{
          gridColumn: `${this.props.colStart} / ${this.props.colEnd}`,
          gridRow: `${this.props.rowStart} / ${this.props.rowEnd}`,
          transform: `translateX(${this.state.xPos}px) translateY(${
            this.state.yPos
          }px) translateZ(0)`,
          WebkitTransform: `translateX(${this.state.xPos}px) translateY(${
            this.state.yPos
          }px) translateZ(0)`,
        }}
        ref={el => {
          this.containerDiv = el;
        }}
      >
        <div
          className={`ConfigurableGridItemEditor_inner${
            this.state.resizeActive
              ? ' ConfigurableGridItemEditor_inner-active'
              : ''
          }`}
          style={{
            top: `${this.state.innerTop}px`,
            right: `${this.state.innerRight}px`,
            bottom: `${this.state.innerBottom}px`,
            left: `${this.state.innerLeft}px`,
          }}
        >
          <ConfigurableGridItemEditorSizeControl
            position="topLeft"
            horizontal={this.resizeLeft}
            vertical={this.resizeTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="top"
            vertical={this.resizeTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="topRight"
            horizontal={this.resizeRight}
            vertical={this.resizeTop}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="left"
            horizontal={this.resizeLeft}
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
            horizontal={this.resizeRight}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottomLeft"
            horizontal={this.resizeLeft}
            vertical={this.resizeBottom}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottom"
            vertical={this.resizeBottom}
            setResizeActive={this.setResizeActive}
          />
          <ConfigurableGridItemEditorSizeControl
            position="bottomRight"
            horizontal={this.resizeRight}
            vertical={this.resizeBottom}
            setResizeActive={this.setResizeActive}
          />
        </div>
      </div>
    );
  }
}

export default ConfigurableGridItemEditor;
