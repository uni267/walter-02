import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// route
import { withRouter } from "react-router-dom";

// material
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableHeader
} from 'material-ui/Table';

import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import SocialPersonAdd from "material-ui/svg-icons/social/person-add";
import Dialog from "material-ui/Dialog";
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

// components
import NavigationContainer from "./NavigationContainer";
// import SimpleSearch from "../components/FileSearch/SimpleSearch";
import UserTableHeader from "../components/User/UserTableHeader";
import UserTableBody from "../components/User/UserTableBody";

// actions
import * as UserActions from "../actions/users";

class UserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: {
        open: false,
        user: {}
      }
    };
  }
  componentWillMount() {
    this.props.actions.requestFetchUsers();
  }

  handleDelete = (user) => {
    this.props.actions.deleteUser(
      user._id,
      this.props.history
    )
    this.handleOpenDialog(user)
  }

  handleOpenDialog = (user) => {
    this.setState({
      deleteDialog: {
        open: !this.state.deleteDialog.open,
        user
      }
    });
  }

  render() {
    const headers = [
      { name: "有効/無効", width: "10%" },
      { name: "アカウント名", width: "25%" },
      { name: "表示名", width: "25%" },
      // { name: "メールアドレス", width: "15%" },
      { name: "所属グループ", width: "20%" },
      { name: "編集", width: "10%" },
      { name: "削除", width: "10%" }
    ];

    const deleteDialogActions = [
      <FlatButton label="削除" secondary={true} onClick={() => (this.handleDelete(this.state.deleteDialog.user))} />,
      <FlatButton label="閉じる" primary={true} onClick={this.handleOpenDialog} />
    ];
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardText>
            <div style={{display: "flex"}}>

              <div style={{width: "20%"}}>
                <CardTitle title="ユーザ管理" />
              </div>

              <div style={{width: "80%"}}>
                <div style={{display: "flex", flexDirection: "row-reverse"}}>
                </div>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "80%" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <UserTableHeader headers={headers} />
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.props.users.map( (user, idx) => {
                      return <UserTableBody headers={headers} user={user} key={idx} handleDelete={this.handleOpenDialog} loginUserId={this.props.session.user_id} />;
                    })}
                  </TableBody>
                </Table>
              </div>

              <div style={{ width: "20%", paddingLeft: 15 }}>
                <Menu>
                  <MenuItem
                    primaryText="ユーザ作成"
                    leftIcon={<SocialPersonAdd />}
                    onTouchTap={() => this.props.history.push("/users/create")}
                    />
                </Menu>
              </div>
            </div>
          </CardText>
        </Card>
        <Dialog
          title={`${this.state.deleteDialog.user.name}(${this.state.deleteDialog.user.account_name}) を削除します`}
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
    users: state.users,
    tenant: state.tenant,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(UserActions, dispatch)
});

UserContainer = connect(mapStateToProps, mapDispatchToProps)(UserContainer);

export default withRouter(UserContainer);
