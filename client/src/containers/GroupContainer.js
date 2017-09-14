import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardTitle, 
  CardText
} from 'material-ui/Card';

import { Table, TableBody, TableHeader } from 'material-ui/Table';

import SocialGroupAdd from "material-ui/svg-icons/social/group-add";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

// components
import NavigationContainer from "./NavigationContainer";
import GroupTableHeader from "../components/Group/GroupTableHeader";
import GroupTableBody from "../components/Group/GroupTableBody";

// actions
import {
  requestFetchGroups
} from "../actions";

class GroupContainer extends Component {
  componentWillMount() {
    this.props.requestFetchGroups(this.props.tenant.tenant_id);
  }

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
          <CardTitle title="グループ管理" />
          <CardText>

            <div style={{ display: "flex" }}>

              <div style={{ width: "80%" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <GroupTableHeader headers={headers} />
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.props.groups.map( (group, idx) => {
                      return <GroupTableBody group={group} key={idx} />;
                    })}
                  </TableBody>
                </Table>
              </div>

              <div style={{ width: "20%", paddingLeft: 15 }}>
                <Divider />
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
  requestFetchGroups: (tenant_id) => dispatch(requestFetchGroups(tenant_id))
});

GroupContainer = connect(mapStateToProps, mapDispatchToProps)(GroupContainer);

export default GroupContainer;
