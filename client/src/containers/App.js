import React, { Component } from 'react';

// router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// app components
import AuthenticationContainer from "./AuthenticationContainer";
import HomeContainer from "./HomeContainer";
import FileDetailContainer from "./FileDetailContainer";
import LoginContainer from "./LoginContainer";
import LoadingContainer from "./LoadingContainer";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <LoadingContainer>
            <Switch>
              <Route exact path="/login" component={LoginContainer} />
              <AuthenticationContainer>
                <Switch>
                  <Route exact path="/" component={HomeContainer} />
                  <Route exact path="/home/:id" component={HomeContainer} />
                  <Route path="/file-detail/:id" component={FileDetailContainer} />
                </Switch>
              </AuthenticationContainer>
            </Switch>
          </LoadingContainer>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
