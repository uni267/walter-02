import React, { Component } from "react";

// store
import { connect } from "react-redux";

// route
import { Link } from "react-router-dom";

// material
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Chip from 'material-ui/Chip';

import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ImageEdit from "material-ui/svg-icons/image/edit";

// components
import NavigationContainer from "./NavigationContainer";

// actions
import { requestFetchUsers } from "../actions";

const UserTableHeader = ({
  headers
}) => {
  return (
    <TableRow>
      {headers.map( (header, idx) => {
        return <TableHeaderColumn key={idx}>{header.name}</TableHeaderColumn>;
      })}
    </TableRow>
  );
};

const UserTableBody = ({
  user, idx
}) => {
  const renderGroups = (groups) => {
    return groups.map( (group, idx)  => (
      <Chip key={idx} style={{ marginRight: 10 }}>
        {group.name}
      </Chip>
    ));
  };

  return (
    <TableRow key={idx}>
      <TableRowColumn>
        {user.enabled ? "有効" : "無効"}
      </TableRowColumn>
      <TableRowColumn>
        {user.name}
      </TableRowColumn>
      <TableRowColumn>
        {user.email}
      </TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {renderGroups(user.groups)}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/users/${user._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};


class UserContainer extends Component {
  componentWillMount() {
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  render() {
    const headers = [
      { name: "有効/無効" },
      { name: "表示名" },
      { name: "メールアドレス" },
      { name: "所属グループ" },
      { name: "" }
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="ユーザ管理" />
          <CardText>
            <div>
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
  requestFetchUsers: (tenant_id) => { dispatch(requestFetchUsers(tenant_id)); }
});

UserContainer = connect(mapStateToProps, mapDispatchToProps)(UserContainer);

export default UserContainer;
