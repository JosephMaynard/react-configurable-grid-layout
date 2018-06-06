import React from 'react';
import ConfigurableGridItemEditorSizeControl from './ConfigurableGridItemEditorSizeControl';

const clamp = (value, min, max) => Math.min(Math.max(min, value), max);

// Probaly a better way of doing this
const closestArrayIndex = (array, target) =>
  array.indexOf(
    array.reduce(function(prev, curr) {
      return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    })
  );

class ConfigurableGridItemEditor extends React.Component {
  state = {
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

  containerDivRef = React.createRef();

  resizeTop = value => {
    const innerTop = clamp(
      value,
      0 - this.containerDivRef.current.offsetTop,
      this.containerDivRef.current.offsetHeight - this.props.rowHeight
    );
    const edgePosition = this.containerDivRef.current.offsetTop + innerTop;
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
      0 -
        (this.props.gridContainerWidth -
          this.containerDivRef.current.offsetLeft -
          this.containerDivRef.current.offsetWidth),
      this.containerDivRef.current.offsetWidth - this.props.columnWidth
    );
    const edgePosition =
      this.containerDivRef.current.offsetLeft +
      this.containerDivRef.current.offsetWidth -
      innerRight;
    const colEnd =
      closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
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
      0 -
        (this.props.gridContainerHeight -
          this.containerDivRef.current.offsetTop -
          this.containerDivRef.current.offsetHeight),
      this.containerDivRef.current.offsetHeight - this.props.rowHeight
    );
    const edgePosition =
      this.containerDivRef.current.offsetTop +
      this.containerDivRef.current.offsetHeight -
      innerBottom;
    const rowEnd = closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
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
      0 - this.containerDivRef.current.offsetLeft,
      this.containerDivRef.current.offsetWidth - this.props.columnWidth
    );
    const edgePosition = this.containerDivRef.current.offsetLeft + innerLeft;
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
      0 - this.containerDivRef.current.offsetLeft,
      this.props.gridContainerWidth -
        this.containerDivRef.current.offsetLeft -
        this.containerDivRef.current.offsetWidth
    );
    const edgePosition = this.containerDivRef.current.offsetLeft + xPos;
    const colStart =
      closestArrayIndex(this.props.columnPositions, edgePosition) + 1;
    if (colStart !== this.state.currentColStart) {
      const columSpan = this.props.colEnd - this.props.colStart;
      this.props.moveGridItem(
        this.props.index,
        colStart,
        colStart + columSpan,
        this.state.currentRowStart,
        this.state.currentRowEnd
      );
      this.setState(prevState => ({
        currentColStart: colStart,
        currentColEnd: colStart + columSpan,
        xPos,
      }));
    } else {
      this.setState(() => ({ xPos }));
    }
  };

  setYPos = value => {
    const yPos = clamp(
      value,
      0 - this.containerDivRef.current.offsetTop,
      this.props.gridContainerHeight -
        this.containerDivRef.current.offsetTop -
        this.containerDivRef.current.offsetHeight
    );
    const edgePosition = this.containerDivRef.current.offsetTop + yPos;
    const rowStart =
      closestArrayIndex(this.props.rowPositions, edgePosition) + 1;
    if (rowStart !== this.state.currentRowStart) {
      const rowSpan = this.props.rowEnd - this.props.rowStart;
      this.props.moveGridItem(
        this.props.index,
        this.state.currentColStart,
        this.state.currentColEnd,
        rowStart,
        rowStart + rowSpan
      );
      this.setState(prevState => ({
        currentRowStart: rowStart,
        currentRowEnd: rowStart + rowSpan,
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
        ref={this.containerDivRef}
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
