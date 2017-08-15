import React, { Component } from 'react';

// router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// app components
import AuthenticationContainer from "./AuthenticationContainer";
import HomeContainer from "./HomeContainer";
import FileDetailContainer from "./FileDetailContainer";
import LoginContainer from "./LoginContainer";
import LoadingContainer from "./LoadingContainer";

class App extends Component {
  render() {
    return (
      <Router>
        <AuthenticationContainer>
          <LoadingContainer>
            <Route exact path="/" component={HomeContainer} />
            <Route exact path="/home" component={HomeContainer} />
            <Route path="/file-detail/:id" component={FileDetailContainer} />
            <Route path="/login" component={LoginContainer} />
          </LoadingContainer>
        </AuthenticationContainer>
      </Router>
    );
  }
}

export default App;
