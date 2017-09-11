import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardTitle, 
  CardText, 
} from 'material-ui/Card';

// components
import NavigationContainer from "./NavigationContainer";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";
import RoleDetailBasic from "../components/Role/RoleDetailBasic";
import RoleOfAction from "../components/Role/RoleOfAction";

// actions
import {
  requestFetchRole,
  requestFetchActions,
  changeRoleName,
  changeRoleDescription,
  saveRoleName,
  saveRoleDescription,
  clearRoleValidationError,
  deleteRoleOfAction,
  addRoleOfAction
} from "../actions";

class RoleDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchAction: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchRole(this.props.match.params.id);
    this.props.requestFetchActions(this.props.tenant.tenant_id);
    this.props.clearRoleValidationError();
  }

  render() {
    const title = `${this.props.role.name}の詳細`;

    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title={<TitleWithGoBack title={title} />} />
          <CardText>

            <div style={{ display: "flex" }} >
              <div style={{ width: "35%", marginRight: 20 }}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <RoleDetailBasic { ...this.props } />
                  </CardText>
                </Card>
              </div>

              <div style={{ width: "35%" }}>
                <Card>
                  <CardTitle subtitle="アクション" />
                  <CardText>
                    <RoleOfAction
                      {...this.props}
                      clearSearchActionText={() => {
                        this.setState({ searchAction: { text: "" } });
                      }}
                      searchAction={this.state.searchAction}
                      />
                  </CardText>
                </Card>
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
    role: state.role.data,
    changedRole: state.role.changed,
    validationErrors: state.role.errors,
    actions: state.actions
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchRole: (role_id) => dispatch(requestFetchRole(role_id)),
  requestFetchActions: () => dispatch(requestFetchActions()),
  changeRoleName: (name) => dispatch(changeRoleName(name)),
  changeRoleDescription: (description) => dispatch(changeRoleDescription(description)),
  saveRoleName: (role) => dispatch(saveRoleName(role)),
  saveRoleDescription: (role) => dispatch(saveRoleDescription(role)),
  clearRoleValidationError: () => dispatch(clearRoleValidationError()),
  deleteRoleOfAction: (role_id, action_id) => {
    dispatch(deleteRoleOfAction(role_id, action_id));
  },
  addRoleOfAction: (role_id, action_id) => dispatch(addRoleOfAction(role_id, action_id))
});

RoleDetailContainer = connect(mapStateToProps, mapDispatchToProps)(RoleDetailContainer);
export default RoleDetailContainer;
