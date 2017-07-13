import React, { Component } from "react";

// material-uis
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui/Table";
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";

// mocks
import USER_GROUPS from "../../mock-user-groups";
import ROLES from "../../mock-roles";

class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { searchText: "" },
      role: { searchText: "" }
    };

  }

  autoCompleteFilter(searchText, key) {
    return key.indexOf(searchText) !== -1;
  }

  render() {
    const { auth, key } = this.props;
    let user;
    let role;

    const userForm = (
      <AutoComplete
        hintText="ユーザ名またはグループ名を入力"
        searchText={this.state.user.searchText}
        floatingLabelText="ユーザ名またはグループ名を入力"
        filter={this.autoCompleteFilter}
        openOnFocus={true}
        dataSource={USER_GROUPS} />
    );

    const roleForm = (
      <AutoComplete
        hintText="ロールを入力"
        searchText={this.state.role.searchText}
        floatingLabelText="ロールを入力"
        filter={this.autoCompleteFilter}
        openOnFocus={true}
        dataSource={ROLES} />
    );

    return (
      <TableRow>
        <TableRowColumn>{userForm}</TableRowColumn>
        <TableRowColumn>{roleForm}</TableRowColumn>
        <TableRowColumn>
          <FlatButton label="delete" />
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default Authority;


