import React, { Component } from "react";

// route
import { withRouter } from "react-router-dom";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardTitle, 
  CardText, 
  CardActions
} from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';

// components
import NavigationContainer from "./NavigationContainer";
import UserDetailBasic from "../components/User/UserDetailBasic";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";

// actions
import {
  initNewUserTemplate,
  changeUserName,
  changeUserEmail,
  changeUserPassword,
  createUser
} from "../actions";

class UserCreateContainer extends Component {
  componentWillMount() {
    this.props.initNewUserTemplate();
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title={<TitleWithGoBack title="ユーザを作成"/>} />
          <CardText>

            <div style={{ display: "flex" }}>
              <div style={{ width: "35%", marginRight: 20 }}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <UserDetailBasic {...this.props} displaySaveButton={false} />
                  </CardText>
                </Card>
              </div>
            </div>
          </CardText>
          <CardActions>
            <FlatButton
              label="保存"
              onTouchTap={() => {
                this.props.createUser(this.props.user.changed, this.props.history);
              }}
              primary={true} />

            <FlatButton
              label="閉じる"
              href="/users" />

          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  initNewUserTemplate: () => dispatch(initNewUserTemplate()),
  changeUserName: (name) => dispatch(changeUserName(name)),
  changeUserEmail: (email) => dispatch(changeUserEmail(email)),
  changeUserPassword: (password) => dispatch(changeUserPassword(password)),
  createUser: (user, history) => dispatch(createUser(user, history))
});

UserCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCreateContainer);

export default withRouter(UserCreateContainer);
