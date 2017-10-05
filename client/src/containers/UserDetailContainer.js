import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import FlatButton from 'material-ui/FlatButton';

import { 
  Card, 
  CardTitle, 
  CardText, 
  CardActions
} from 'material-ui/Card';

// actions
import * as actions from "../actions";

// components
import NavigationContainer from "./NavigationContainer";
import UserDetailBasic from "../components/User/UserDetailBasic";
import UserBelongsToGroup from "../components/User/UserBelongsToGroup";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";

class UserDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchUser(
      this.props.match.params.id, this.props.tenant.tenant_id
    );
  }

  componentWillUnmount() {
    this.props.initNewUserTemplate();
    this.props.clearUserValidationError();
  }

  render() {
    const title = `${this.props.user.data.name}の詳細`;
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title={<TitleWithGoBack title={title} />} />
          <CardText>

            <div style={{ display: "flex" }}>
              <div style={{ width: "35%", marginRight: 20 }}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <UserDetailBasic {...this.props} />
                  </CardText>
                </Card>
              </div>

              <div style={{ width: "35%" }}>
                <Card>
                  <CardTitle subtitle="所属グループ" />
                  <CardText>

                    <UserBelongsToGroup
                      {...this.props}
                      clearGroupText={() => this.setState({ group: { text: "" } })}
                      group={this.state.group} />

                  </CardText>
                </Card>
              </div>

            </div>
          </CardText>
          <CardActions>
            <FlatButton
              label="閉じる"
              onTouchTap={() => this.props.history.push("/users")}
              primary={true} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    tenant: state.tenant,
    groups: state.groups.data
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchUser: (user_id, tenant_id) => { 
    dispatch(actions.requestFetchUser(user_id, tenant_id));
  },
  deleteGroupOfUser: (user_id, group_id) => {
    dispatch(actions.deleteGroupOfUser(user_id, group_id));
  },
  addGroupOfUser: (user_id, group_id) => {
    dispatch(actions.addGroupOfUser(user_id, group_id));
  },
  toggleUser: (user_id) => {
    dispatch(actions.toggleUser(user_id));
  },
  changeUserName: (name) => dispatch(actions.changeUserName(name)),
  changeUserAccountName: (account_name) => {
    dispatch(actions.changeUserAccountName(account_name));
  },
  changeUserEmail: (email) => dispatch(actions.changeUserEmail(email)),
  changeUserPassword: (password) => dispatch(actions.changeUserPassword(password)),
  saveUserName: (user) => dispatch(actions.saveUserName(user)),
  saveUserAccountName: (user) => {
    dispatch(actions.saveUserAccountName(user));
  },
  saveUserEmail: (user) => dispatch(actions.saveUserEmail(user)),
  saveUserPasswordForce: (user) => dispatch(actions.saveUserPasswordForce(user)),
  initNewUserTemplate: () => dispatch(actions.initNewUserTemplate()),
  clearUserValidationError: () => dispatch(actions.clearUserValidationError())
});

UserDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailContainer);
export default UserDetailContainer;
