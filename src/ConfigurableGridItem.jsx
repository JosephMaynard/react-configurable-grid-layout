import React from 'react';

class ConfigurableGridItem extends React.Component {
  render(){
    return(
      <div
        className="ConfigurableGridItem"
        style={{
          gridColumn: `${this.props.colStart} / ${this.props.colEnd}`,
          gridRow: `${this.props.rowStart} / ${this.props.rowEnd}`,
          backgroundColor: this.props.backgroundColor,
        }}
      >
      </div>
    );
  }
}

export default ConfigurableGridItem;
