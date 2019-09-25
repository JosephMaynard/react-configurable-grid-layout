import React from 'react';
import PropTypes from 'prop-types';

class ConfigurableGridItem extends React.Component {
  state = {};

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

ConfigurableGridItem.propTypes = {
  colStart: PropTypes.number.isRequired,
  colEnd: PropTypes.number.isRequired,
  rowStart: PropTypes.number.isRequired,
  rowEnd: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};

export default ConfigurableGridItem;
