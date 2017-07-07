import React, { Component } from 'react';

// material
import injectTapEventPlugin from 'react-tap-event-plugin';

// app components
import NavigationContainer from "./containers/NavigationContainer";
import FileBoxContainer from "./containers/FileBox";

injectTapEventPlugin();

class App extends Component {
  render() {
    const getDirId = () => {
      const params = new URLSearchParams(this.props.location.search);
      return (params.get("dir_id") === null) ?
        0 : params.get("dir_id");
    };

    return (
      <div className="app">
        <NavigationContainer />
        <FileBoxContainer dir_id={getDirId()}/>
      </div>
    );
  }
}

export default App;
