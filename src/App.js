import React from 'react';
import ConfigurableGrid from './ConfigurableGrid';
import './App.css';

class App extends React.Component {
  state = {
    editable: true,
  }
  render() {
    return (
      <ConfigurableGrid
        rows={4}
        columns={4}
        gridGap={10}
        editable={this.state.editable}
      />
    );
  }
}

export default App;
