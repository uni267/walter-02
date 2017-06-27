import React, { Component } from 'react';
import { Card } from "material-ui/Card";

import Logo from "./components/Logo";
import FileBox from "./components/FileBox";

class App extends Component {
  render() {
    return (
      <Card>
        <div className="App">
          <Logo />
          <FileBox />
        </div>
      </Card>
    );
  }
}

export default App;
