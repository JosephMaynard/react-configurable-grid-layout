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
        columns={6}
        gridGap={0}
        editable={this.state.editable}
      />
    );
  }
}

export default App;
