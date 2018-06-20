import React from 'react';
import PropTypes from 'prop-types';
import ConfigurableGridItem from './ConfigurableGridItem';
import ConfigurableGridItemEditor from './ConfigurableGridItemEditor';

const randomChar = () =>
  (Math.floor(Math.random() * 8) + 5).toString(16).toUpperCase();

const randomHex = () =>
  `#${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}`;

const createGridMap = (rows, columns, content = 0) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => content)
  );

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

const mapItemCSSPropertiesToTableHierarchy = (
  gridMap,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  itemIndex
) =>
  gridMap.map((row, rowIndex) =>
    row.map((columnValue, columnIndex) => {
      if (
        rowIndex >= rowStart - 1 &&
        rowIndex <= rowEnd - 2 &&
        columnIndex >= colStart - 1 &&
        columnIndex <= colEnd - 2
      ) {
        return itemIndex;
      }
      return columnValue;
    })
  );

const checkForCollisions = (gridItems, rows, columns) => {
  let gridMap = createGridMap(rows, columns);
  gridItems.forEach(gridItem => {
    gridMap = mapItemCSSPropertiesToGridMap(
      gridMap,
      gridItem.colStart,
      gridItem.colEnd,
      gridItem.rowStart,
      gridItem.rowEnd
    );
  });
  gridMap = [].concat(...gridMap);
  const collisions = gridMap.filter(cell => cell > 1);
  console.log(gridMap, collisions, collisions.length > 0);
  return collisions.length > 0;
};

const createTableHierarchy = (gridItems, rows, columns) => {
  let gridMap = createGridMap(rows, columns, ' ');
  gridItems.forEach((gridItem, itemIndex) => {
    gridMap = mapItemCSSPropertiesToTableHierarchy(
      gridMap,
      gridItem.colStart,
      gridItem.colEnd,
      gridItem.rowStart,
      gridItem.rowEnd,
      itemIndex
    );
  });
  console.log('Table Hierarchy');
  console.log(gridMap);
};

class ConfigurableGrid extends React.Component {
  state = {
    columnWidth: 0,
    rowHeight: 0,
    gridContainerWidth: 0,
    gridContainerHeight: 0,
    columnPositions: [],
    rowPositions: [],
    gridItems: [
      {
        backgroundColor: randomHex(),
        colStart: 1,
        colEnd: 5,
        rowStart: 1,
        rowEnd: 4,
      },
      {
        backgroundColor: randomHex(),
        colStart: 5,
        colEnd: 7,
        rowStart: 1,
        rowEnd: 5,
      },
      {
        backgroundColor: randomHex(),
        colStart: 1,
        colEnd: 5,
        rowStart: 4,
        rowEnd: 5,
      },
    ],
    gridLayoutCache: [],
  };
  componentDidMount() {
    this.setGridSizes();
    this.updateGridCache();
    this.updateGridMap();
    window.addEventListener('resize', this.setGridSizes);
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
  componentWillUnmount() {
    window.removeEventListener('resize', this.setGridSizes);
  }
  setGridSizes = () => {
    const gridContainerWidth = this.gridContainerRef.current.offsetWidth;
    const gridContainerHeight = this.gridContainerRef.current.offsetHeight;
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

  gridContainerRef = React.createRef();

  updateGridItemProperty = (gridItemIndex, property, value) => {
    const gridItems = this.state.gridItems.map(item => ({ ...item }));
    gridItems[gridItemIndex][property] = value;
    if (
      checkForCollisions(gridItems, this.props.rows, this.props.columns) ===
        false ||
      this.props.preventOverlaps === false
    ) {
      this.setState({ gridItems });
      this.updateGridMap();
    } else {
      console.log('Collision!');
    }
    createTableHierarchy(gridItems, this.props.rows, this.props.columns);
  };

  moveGridItem = (gridItemIndex, colStart, colEnd, rowStart, rowEnd) => {
    const gridItems = this.state.gridItems.map(item => ({ ...item }));
    gridItems[gridItemIndex] = {
      ...gridItems[gridItemIndex],
      colStart,
      colEnd,
      rowStart,
      rowEnd,
    };
    if (
      checkForCollisions(gridItems, this.props.rows, this.props.columns) ===
        false ||
      this.props.preventOverlaps === false
    ) {
      this.setState({ gridItems });
      this.updateGridMap();
    } else {
      console.log('Collision!');
    }
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
          msGridRows: `${Math.round(
            this.state.gridContainerHeight / this.props.rows
          )}px `.repeat(this.props.rows),
          msGridColumns: `${Math.round(
            this.state.gridContainerWidth / this.props.columns
          )}px `.repeat(this.props.columns),
        }}
        ref={this.gridContainerRef}
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
              moveGridItem={this.moveGridItem}
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

ConfigurableGrid.propTypes = {
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  gridGap: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  preventOverlaps: PropTypes.bool,
};

ConfigurableGrid.defaultProps = {
  preventOverlaps: true,
};

export default ConfigurableGrid;
