import React, { Component } from "react";

// route
import { Link } from "react-router-dom";

// store
import { connect } from "react-redux";

// material
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from "material-ui/AutoComplete";
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from "material-ui/MenuItem";
import SocialGroup from "material-ui/svg-icons/social/group";
import Chip from 'material-ui/Chip';
import Divider from "material-ui/Divider";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

// actions
import {
  requestFetchUser,
  deleteGroupOfUser,
  addGroupOfUser,
  toggleUser,
  changeUserName,
  changeUserEmail,
  changeUserPassword,
  saveUserName,
  saveUserEmail,
  saveUserPassword
} from "../actions";

// components
import NavigationContainer from "./NavigationContainer";
import UserDetailBasic from "../components/User/UserDetailBasic";
import UserBelongsToGroup from "../components/User/UserBelongsToGroup";

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

  render() {
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title={`${this.props.user.data.name}の詳細`} />
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
            <FlatButton label="閉じる" primary={true} href="/users" />
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
    dispatch(requestFetchUser(user_id, tenant_id));
  },
  deleteGroupOfUser: (user_id, group_id) => {
    dispatch(deleteGroupOfUser(user_id, group_id));
  },
  addGroupOfUser: (user_id, group_id) => {
    dispatch(addGroupOfUser(user_id, group_id));
  },
  toggleUser: (user_id) => {
    dispatch(toggleUser(user_id));
  },
  changeUserName: (name) => dispatch(changeUserName(name)),
  changeUserEmail: (email) => dispatch(changeUserEmail(email)),
  changeUserPassword: (password) => dispatch(changeUserPassword(password)),
  saveUserName: (user) => dispatch(saveUserName(user)),
  saveUserEmail: (user) => dispatch(saveUserEmail(user)),
  saveUserPassword: (user) => dispatch(saveUserPassword(user))
});

UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer);
export default UserDetailContainer;
