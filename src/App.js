import React, { Component } from 'react';

// router
import { BrowserRouter as Router, Route } from 'react-router-dom';

// app components
import HomeContainer from "./containers/HomeContainer";
import FileDetailContainer from "./containers/FileDetailContainer";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/home" component={HomeContainer} />
          <Route path="/file-detail/:id" component={FileDetailContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
