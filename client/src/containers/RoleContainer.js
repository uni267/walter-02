import React, { Component } from "react";

// router
import { Link } from "react-router-dom";

// store
import { connect } from "react-redux";

// material ui
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

import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";
import Chip from "material-ui/Chip";

// components
import NavigationContainer from "./NavigationContainer";

// actions
import {
  requestFetchRoles
} from "../actions";

const RoleTableHeader = ({headers}) => {
  return (
    <TableRow>
      {headers.map( (header, idx) => (
        <TableHeaderColumn key={idx}>{header.name}</TableHeaderColumn>
      ))}
    </TableRow>
  );
};

const RoleTableBody = ({role, key}) => {
  return (
    <TableRow key={key}>
      <TableRowColumn>{role.name}</TableRowColumn>
      <TableRowColumn>{role.description}</TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {role.actions.map( (action, idx) => {
            return <Chip key={idx} style={{ marginRight: 10 }}>{action.label}</Chip>;
          })}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/roles/${role._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

class RoleContainer extends Component {
  componentWillMount() {
    this.props.requestFetchRoles(this.props.tenant.tenant_id);
  }

  render() {
    const headers = [
      { name: "表示名" },
      { name: "備考" },
      { name: "アクション" },
      { name: "編集" }
    ];

    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title="ロール管理" />
          <CardText>
            <div style={{ display: "flex" }}>
              <div style={{ width: "80%" }}>
                <Table>

                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <RoleTableHeader headers={headers} />
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.props.roles.map( (role, idx) => {
                      return <RoleTableBody role={role} key={idx} />;
                    })}
                  </TableBody>

                </Table>
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
    tenant: state.tenant,
    roles: state.roles.data
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchRoles: (tenant_id) => dispatch(requestFetchRoles(tenant_id))
});

RoleContainer = connect(mapStateToProps, mapDispatchToProps)(RoleContainer);
export default RoleContainer;
