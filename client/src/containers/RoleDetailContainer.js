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
import RoleAction from "../components/Role/RoleAction";

// actions
import {
  requestFetchRole,
  changeRoleName,
  changeRoleDescription,
  saveRoleName,
  saveRoleDescription,
  clearRoleValidationError,
  deleteRoleOfAction
} from "../actions";

class RoleDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchRole(this.props.match.params.id);
    this.props.clearRoleValidationError();
  }

  render() {
    const title = `${this.props.role.name}の詳細`;

    console.log(this.props.role.actions);
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
                    <RoleAction {...this.props} />
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
    validationErrors: state.role.errors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchRole: (role_id) => dispatch(requestFetchRole(role_id)),
  changeRoleName: (name) => dispatch(changeRoleName(name)),
  changeRoleDescription: (description) => dispatch(changeRoleDescription(description)),
  saveRoleName: (role) => dispatch(saveRoleName(role)),
  saveRoleDescription: (role) => dispatch(saveRoleDescription(role)),
  clearRoleValidationError: () => dispatch(clearRoleValidationError()),
  deleteRoleOfAction: (role_id, action_id) => {
    dispatch(deleteRoleOfAction(role_id, action_id));
  }
});

RoleDetailContainer = connect(mapStateToProps, mapDispatchToProps)(RoleDetailContainer);
export default RoleDetailContainer;
