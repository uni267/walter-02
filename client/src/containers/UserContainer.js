import React, { Component } from "react";

// store
import { connect } from "react-redux";

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

// components
import NavigationContainer from "./NavigationContainer";

// actions
import { requestFetchUsers } from "../actions";


class UserContainer extends Component {
  componentWillMount() {
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  renderGroups = (groups) => {
    return groups.map( (group, idx)  => (
      <Chip key={idx}>{group.name}</Chip>
    ));
  };

  renderTableBody = (user, idx) => {
    return (
      <TableRow key={idx}>
        <TableRowColumn>
          {user.enabled ? "e" : "d"}
        </TableRowColumn>
        <TableRowColumn>
          {user.name}
        </TableRowColumn>
        <TableRowColumn>
          {user.email}
        </TableRowColumn>
        <TableRowColumn>
          {this.renderGroups(user.groups)}
        </TableRowColumn>
        <TableRowColumn>
          edit_button
        </TableRowColumn>
      </TableRow>
    );
  };

  render() {
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="ユーザ管理" />
          <CardText>

            <div>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>enable/disable</TableHeaderColumn>
                    <TableHeaderColumn>name</TableHeaderColumn>
                    <TableHeaderColumn>e-mail</TableHeaderColumn>
                    <TableHeaderColumn>groups</TableHeaderColumn>
                    <TableHeaderColumn>action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>

                <TableBody displayRowCheckbox={false}>
                  {this.props.users.map(this.renderTableBody)}
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
