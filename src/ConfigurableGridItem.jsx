import React from 'react';

class ConfigurableGridItem extends React.Component {
  render() {
    return (
      <div
        className="ConfigurableGridItem"
        style={{
          gridColumn: `${this.props.colStart} / ${this.props.colEnd}`,
          gridRow: `${this.props.rowStart} / ${this.props.rowEnd}`,
          backgroundColor: this.props.backgroundColor,
          msGridColumn: this.props.colStart,
          msGridColumnSpan: this.props.colEnd - this.props.colStart,
          msGridRow: this.props.rowStart,
          msGridRowSpan: this.props.rowEnd - this.props.rowStart,
        }}
      />
    );
  }
}

export default ConfigurableGridItem;
