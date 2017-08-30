import React, { Component } from 'react';

// router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// app components
import AuthenticationContainer from "./AuthenticationContainer";
import HomeContainer from "./HomeContainer";
import FileDetailContainer from "./FileDetailContainer";
import LoginContainer from "./LoginContainer";
import LoadingContainer from "./LoadingContainer";
import UserContainer from "./UserContainer";

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
                  <Route path="/users" component={UserContainer} />
                  <Route path="/file-detail/:id" component={FileDetailContainer} />
                  <Route exact path="/home/:id" component={HomeContainer} />
                  <Route path="/" component={HomeContainer} />
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
