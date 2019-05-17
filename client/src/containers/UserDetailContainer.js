import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material
import FlatButton from 'material-ui/FlatButton';

import {
  Card,
  CardTitle,
  CardText,
  CardActions
} from 'material-ui/Card';
import Dialog from "material-ui/Dialog";

// actions
import * as UserActions from "../actions/users";

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
      },
      deleteDialog: {
        open: false,
        user: {}
      }
    };
  }

  componentWillMount() {
    this.props.actions.requestFetchUser(
      this.props.match.params.id, this.props.tenant.tenant_id
    );
    this.props.actions.requestFetchRoleMenus();
  }

  componentWillUnmount() {
    this.props.actions.initNewUserTemplate();
    this.props.actions.clearUserValidationError();
  }

  handleDelete = () => {
    this.props.actions.deleteUser(
      this.props.user.data._id,
      this.props.history
    )
    this.handleOpenDialog()
  }

  handleOpenDialog = () => {
    this.setState({
      deleteDialog: {
        open: !this.state.deleteDialog.open,
      }
    });
  }

  render() {
    const title = `${this.props.user.data.name}の詳細`;
    const deleteDialogActions = [
      <FlatButton label="削除" secondary={true} onClick={() => (this.handleDelete(this.state.deleteDialog.user))} />,
      <FlatButton label="閉じる" primary={true} onClick={this.handleOpenDialog} />
    ];

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
            <FlatButton
              label="削除"
              secondary={true}
              onTouchTap={this.handleOpenDialog}
              disabled={this.props.session.user_id === this.props.user.data._id}
            />
          </CardActions>
        </Card>
        <Dialog
          title={`${this.props.user.data.name}(${this.props.user.data.account_name}) を削除します`}
          modal={false}
          open={this.state.deleteDialog.open}
          onRequestClose={this.handleOpenDialog}
          actions={deleteDialogActions}
        >
          <b>※ 削除したユーザは元に戻すことができません</b>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    tenant: state.tenant,
    groups: state.groups.data,
    roleMenus: state.roleMenus,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(UserActions, dispatch)
});

UserDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailContainer);
export default UserDetailContainer;
