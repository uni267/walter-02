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

// components
import NavigationContainer from "./NavigationContainer";

// actions
import {
  requestFetchGroups
} from "../actions";

const GroupTableHeader = ({ headers }) => {
  return (
    <TableRow>
      {headers.map( (header, idx) => (
        <TableHeaderColumn key={idx}>{header.name}</TableHeaderColumn>
      ))}
    </TableRow>
  );
};

const GroupTableBody = ({ group, key }) => {
  return (
    <TableRow>
      <TableRowColumn>{group.name}</TableRowColumn>
      <TableRowColumn>{group.description}</TableRowColumn>
      <TableRowColumn>{group.belongs_to_count}人</TableRowColumn>
      <TableRowColumn></TableRowColumn>
      <TableRowColumn></TableRowColumn>
    </TableRow>
  );
};

class GroupContainer extends Component {
  componentWillMount() {
    this.props.requestFetchGroups(this.props.tenant.tenant_id);
  }

  render() {
    const headers = [
      { name: "表示名" },
      { name: "備考" },
      { name: "所属人数" },
      { name: "編集" },
      { name: "削除" }
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="グループ管理" />
          <CardText>

            <div>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <GroupTableHeader headers={headers} />
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.props.group.map( (group, idx) => {
                    return <GroupTableBody group={group} key={idx} />;
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
    group: state.group.data,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchGroups: (tenant_id) => dispatch(requestFetchGroups(tenant_id))
});

GroupContainer = connect(mapStateToProps, mapDispatchToProps)(GroupContainer);

export default GroupContainer;
