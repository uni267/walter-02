import React, { Component } from "react";

// store
import { connect } from "react-redux";

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

// components
import NavigationContainer from "./NavigationContainer";
import SimpleSearch from "../components/FileSearch/SimpleSearch";
import UserTableHeader from "../components/User/UserTableHeader";
import UserTableBody from "../components/User/UserTableBody";

// actions
import * as actions from "../actions";

class UserContainer extends Component {
  componentWillMount() {
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  render() {
    const headers = [
      { name: "有効/無効" },
      { name: "アカウント名" },
      { name: "表示名" },
      { name: "メールアドレス" },
      { name: "所属グループ" },
      { name: "編集" }
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
                  <SimpleSearch
                    searchFileSimple={(keyword) => {
                      this.props.searchUsersSimple(
                        this.props.tenant.tenant_id,
                        keyword
                      );
                    }}
                    />
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
                      return <UserTableBody user={user} key={idx} />;
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchUsers: (tenant_id) => dispatch(actions.requestFetchUsers(tenant_id)),
  searchUsersSimple: (tenant_id, keyword) => {
    dispatch(actions.searchUsersSimple(tenant_id, keyword));
  }
});

UserContainer = connect(mapStateToProps, mapDispatchToProps)(UserContainer);

export default withRouter(UserContainer);
