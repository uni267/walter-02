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
import UserDetailContainer from "./UserDetailContainer";
import UserCreateContainer from "./UserCreateContainer";
import GroupContainer from "./GroupContainer";
import GroupDetailContainer from "./GroupDetailContainer";
import GroupCreateContainer from "./GroupCreateContainer";
import RoleContainer from "./RoleContainer";
import RoleDetailContainer from "./RoleDetailContainer";
import RoleCreateContainer from "./RoleCreateContainer";

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
                  <Route exact path="/users" component={UserContainer} />
                  <Route exact path="/users/create" component={UserCreateContainer} />
                  <Route path="/users/:id" component={UserDetailContainer} />
                  <Route exact path="/groups" component={GroupContainer} />
                  <Route exact path="/groups/create" component={GroupCreateContainer} />
                  <Route path="/groups/:id" component={GroupDetailContainer} />
                  <Route path="/file-detail/:id" component={FileDetailContainer} />
                  <Route exact path="/home" component={HomeContainer} />
                  <Route path="/home/:id" component={HomeContainer} />
                  <Route exact path="/roles" component={RoleContainer} />
                  <Route exact path="/roles/create" component={RoleCreateContainer} />
                  <Route path="/roles/:id" component={RoleDetailContainer} />
                  <Route component={HomeContainer} />
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
