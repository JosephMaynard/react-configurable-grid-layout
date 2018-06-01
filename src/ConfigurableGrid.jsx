import React from 'react';
import ConfigurableGridItem from './ConfigurableGridItem';
import ConfigurableGridItemEditor from './ConfigurableGridItemEditor';

const randomChar = () => (Math.floor(Math.random() * 6) + 5)
    .toString(16)
    .toUpperCase();

const randomHex = () => {
  return `#${randomChar()}${randomChar()}${randomChar()}`
}

class ConfigurableGrid extends React.Component {
  constructor(props){
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
    }
  }
  componentDidMount(){
    this.setGridSizes();
    this.updateGridCache();
    window.addEventListener('resize', this.setGridSizes);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.setGridSizes);
  }
  setGridSizes = () => {
    const gridContainerWidth = this.gridContainer.offsetWidth;
    const gridContainerHeight = this.gridContainer.offsetHeight;
    const columnWidth = Math.round(
      (gridContainerWidth - (
        this.props.gridGap * (this.props.columns - 1)
      )) / this.props.columns);
    const rowHeight =  Math.round(
      (gridContainerHeight - (
        this.props.gridGap * (this.props.rows - 1)
      )) / this.props.rows);
    const columnPositions = Array.from(
      {length: this.props.columns + 1},
      (value, index) => Math.floor(index * columnWidth));
    const rowPositions = Array.from(
      {length: this.props.rows + 1},
      (value, index) => Math.floor(index * columnWidth));
    this.setState({
      columnWidth,
      rowHeight,
      columnPositions,
      rowPositions,
      gridContainerWidth,
      gridContainerHeight,
    });
  }
  updateGridItemProperty = (gridItemIndex, property, value) => {
    const gridItems = this.state.gridItems.map(item => ({...item}));
    gridItems[gridItemIndex][property] = value;
    this.setState({gridItems});
  }
  updateGridCache = () => this.setState({gridLayoutCache: this.state.gridItems.map(item => ({...item}))});
  render(){
    return(
      <div
        className="ConfigurableGrid"
        style={{
          gridTemplateColumns: `repeat(${this.props.columns}, 1fr)`,
          gridTemplateRows: `repeat(${this.props.rows}, 1fr)`,
          gridGap: `${this.props.gridGap}px`,
        }}
        ref={( el ) => { this.gridContainer = el; }}
      >
        {this.state.gridItems.map((item, index) => (
          <ConfigurableGridItem
            {...item}
            key={index}
            index={index}
          />
        ))}
        {this.props.editable && this.state.gridLayoutCache.map((item, index) => (
          <ConfigurableGridItemEditor
            {...item}
            key={index}
            index={index}
            columnPositions={this.state.columnPositions}
            rowPositions={this.state.rowPositions}
            updateGridItemProperty={this.updateGridItemProperty}
            updateGridCache={this.updateGridCache}
          />
        ))}
      </div>
    )
  }
}

export default ConfigurableGrid;
