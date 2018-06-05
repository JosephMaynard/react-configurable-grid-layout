import React from 'react';
import ConfigurableGridItem from './ConfigurableGridItem';
import ConfigurableGridItemEditor from './ConfigurableGridItemEditor';

const randomChar = () =>
  (Math.floor(Math.random() * 6) + 5).toString(16).toUpperCase();

const randomHex = () => {
  return `#${randomChar()}${randomChar()}${randomChar()}`;
};

const createGridMap = (rows, columns) =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

const mapItemCSSPropertiesToGridMap = (
  gridMap,
  colStart,
  colEnd,
  rowStart,
  rowEnd
) =>
  gridMap.map((row, rowIndex) =>
    row.map((columnValue, columnIndex) => {
      if (
        rowIndex >= rowStart - 1 &&
        rowIndex <= rowEnd - 2 &&
        columnIndex >= colStart - 1 &&
        columnIndex <= colEnd - 2
      ) {
        return columnValue + 1;
      }
      return columnValue;
    })
  );

class ConfigurableGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnWidth: 0,
      rowHeight: 0,
      gridContainerWidth: 0,
      gridContainerHeight: 0,
      columnPositions: [],
      rowPositions: [],
      gridItems: [
        {
          backgroundColor: randomHex(),
          colStart: 2,
          colEnd: 4,
          rowStart: 2,
          rowEnd: 4,
        },
        {
          backgroundColor: randomHex(),
          colStart: 4,
          colEnd: 5,
          rowStart: 4,
          rowEnd: 5,
        },
      ],
      gridLayoutCache: [],
    };
  }
  componentDidMount() {
    this.setGridSizes();
    this.updateGridCache();
    this.updateGridMap();
    window.addEventListener('resize', this.setGridSizes);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setGridSizes);
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.columns !== prevProps.columns ||
      this.props.rows !== prevProps.rows ||
      this.props.gridGap !== prevProps.gridGap
    ) {
      this.setGridSizes();
    }
  }
  setGridSizes = () => {
    const gridContainerWidth = this.gridContainer.offsetWidth;
    const gridContainerHeight = this.gridContainer.offsetHeight;
    const columnWidth = Math.round(
      (gridContainerWidth - this.props.gridGap * (this.props.columns - 1)) /
        this.props.columns
    );
    const rowHeight = Math.round(
      (gridContainerHeight - this.props.gridGap * (this.props.rows - 1)) /
        this.props.rows
    );
    const columnPositions = Array.from(
      { length: this.props.columns + 1 },
      (value, index) => Math.floor(index * columnWidth)
    );
    const rowPositions = Array.from(
      { length: this.props.rows + 1 },
      (value, index) => Math.floor(index * rowHeight)
    );
    this.setState({
      columnWidth,
      rowHeight,
      columnPositions,
      rowPositions,
      gridContainerWidth,
      gridContainerHeight,
    });
  };
  updateGridItemProperty = (gridItemIndex, property, value) => {
    const gridItems = this.state.gridItems.map(item => ({ ...item }));
    gridItems[gridItemIndex][property] = value;
    this.setState({ gridItems });
    this.updateGridMap();
  };
  updateGridCache = () =>
    this.setState({
      gridLayoutCache: this.state.gridItems.map(item => ({ ...item })),
    });
  updateGridMap = () => {
    let gridMap = createGridMap(this.props.rows, this.props.columns);
    this.state.gridItems.forEach(gridItem => {
      gridMap = mapItemCSSPropertiesToGridMap(
        gridMap,
        gridItem.colStart,
        gridItem.colEnd,
        gridItem.rowStart,
        gridItem.rowEnd
      );
    });
    console.log(gridMap);
  };
  render() {
    return (
      <div
        className="ConfigurableGrid"
        style={{
          gridTemplateColumns: `repeat(${this.props.columns}, 1fr)`,
          gridTemplateRows: `repeat(${this.props.rows}, 1fr)`,
          gridGap: `${this.props.gridGap}px`,
        }}
        ref={el => {
          this.gridContainer = el;
        }}
      >
        {this.state.gridItems.map((item, index) => (
          <ConfigurableGridItem {...item} key={index} index={index} />
        ))}
        {this.props.editable &&
          this.state.gridLayoutCache.map((item, index) => (
            <ConfigurableGridItemEditor
              {...item}
              key={index}
              index={index}
              columnPositions={this.state.columnPositions}
              rowPositions={this.state.rowPositions}
              updateGridItemProperty={this.updateGridItemProperty}
              updateGridCache={this.updateGridCache}
              columnWidth={this.state.columnWidth}
              rowHeight={this.state.rowHeight}
              gridContainerWidth={this.state.gridContainerWidth}
              gridContainerHeight={this.state.gridContainerHeight}
            />
          ))}
      </div>
    );
  }
}

export default ConfigurableGrid;
