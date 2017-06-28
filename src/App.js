import React, { Component } from 'react';
import { Card } from "material-ui/Card";

import Logo from "./components/Logo";
import AppMenu from "./components/AppMenu";
import FileBox from "./components/FileBox";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Card>
          <Logo />
          <AppMenu />
          <FileBox />
        </Card>
      </div>
    );
  }
}

export default App;
