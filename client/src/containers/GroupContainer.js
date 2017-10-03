import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardTitle, 
  CardText
} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import SocialGroupAdd from "material-ui/svg-icons/social/group-add";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

// components
import NavigationContainer from "./NavigationContainer";
import GroupTableHeader from "../components/Group/GroupTableHeader";
import GroupTableBody from "../components/Group/GroupTableBody";
import SimpleSearch from "../components/FileSearch/SimpleSearch";

// actions
import * as actions from "../actions";

class GroupContainer extends Component {
  componentWillMount() {
    this.props.requestFetchGroups(this.props.tenant.tenant_id);
  }

  renderGroups = (groups) => {
    return groups.length === 0
      ?
      (
        <TableRow>
          <TableRowColumn>一致するグループはありません</TableRowColumn>
        </TableRow>
      )
      : groups.map( (group, idx) => <GroupTableBody group={group} key={idx} />);
  };

  render() {
    const headers = [
      { name: "表示名" },
      { name: "備考" },
      { name: "ユーザ" },
      { name: "編集" },
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardText>

            <div style={{ display: "flex" }}>
              <div style={{ width: "20%" }}>
                <CardTitle title="グループ管理" />
              </div>

              <div style={{ width: "80%" }}>
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                  <SimpleSearch
                    searchFileSimple={ keyword => (
                      this.props.searchGroupSimple(keyword)
                    )}
                    hintText="グループ名を入力"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "80%" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <GroupTableHeader headers={headers} />
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.renderGroups(this.props.groups)}
                  </TableBody>
                </Table>
              </div>
              
              <div style={{ width: "20%", paddingLeft: 15 }}>
                <Menu>
                  <MenuItem 
                    primaryText="グループ作成"
                    leftIcon={<SocialGroupAdd />}
                    onTouchTap={() => this.props.history.push("/groups/create")} />
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
    groups: state.groups.data,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchGroups: (tenant_id) => dispatch(actions.requestFetchGroups(tenant_id)),
  searchGroupSimple: (keyword) => dispatch(actions.searchGroupSimple(keyword))
});

GroupContainer = connect(mapStateToProps, mapDispatchToProps)(GroupContainer);

export default GroupContainer;
