import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardTitle, 
  CardText, 
  CardActions
} from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";

// components
import NavigationContainer from "./NavigationContainer";
import RoleCreateBasic from "../components/Role/RoleCreateBasic";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";

// actions
import {
  changeRoleName,
  changeRoleDescription,
  createRole
} from "../actions";

class RoleCreateContainer extends Component {
  render() {
    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title={<TitleWithGoBack title="ロール作成" />} />
          <CardText>
            <div style={{ display: "flex" }}>
              <Card style={{ width: "35%", marginRight: 20 }}>
                <CardTitle subtitle="基本情報" />
                <CardText>
                  <RoleCreateBasic {...this.props} />
                </CardText>
              </Card>
            </div>
          </CardText>

          <CardActions>
            <FlatButton
              label="保存"
              primary={true}
              onTouchTap={() => this.props.createRole(this.props.changedRole)}
              />

              <FlatButton label="閉じる" href="/roles" />
          </CardActions>
        </Card>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    changedRole: state.role.changed,
    validationErrors: state.role.errors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeRoleName: (name) => dispatch(changeRoleName(name)),
  changeRoleDescription: (description) => dispatch(changeRoleDescription(description)),
  createRole: (role) => dispatch(createRole(role, ownProps.history))
});

RoleCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoleCreateContainer);

export default RoleCreateContainer;
