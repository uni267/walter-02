import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";

// components
import NavigationContainer from "./NavigationContainer";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";
import RoleMenuDetailBasic from "../components/RoleMenu/RoleMenuDetailBasic";

// actions
import * as MenuActions from "../actions/menus";

class RoleMenuDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMenu: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.roleMenuActions.requestFetchRoleMenu(this.props.match.params.id);
    this.props.roleMenuActions.requestFetchRoleMenus();
    this.props.roleMenuActions.clearRoleMenuValidationError();
  }

  render() {
    const title = `${this.props.menu.name}の詳細`;
    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title={<TitleWithGoBack title={title} />}/>
          <CardText>

            <div style={{ display: "flex" }}>
              <div style={{ width: "35%", marginRight: 20}}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <RoleMenuDetailBasic { ...this.props } />
                  </CardText>
                </Card>
              </div>
              <div style={{ width: "35%" }}>
                <Card>
                  <CardTitle subtitle="メニュー"/>
                  <CardText>
                    {/* <RoleOfMenu
                    > */}
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

const mapStateToProps = (state, ownProps) =>{
  return {
    tenant: state.tenant,
    menu: state.menu.data,
    changedMenu: state.menu.changed,
    validationErrors: state.menu.errors,
    menus: state.menus
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  roleMenuActions: bindActionCreators(MenuActions,dispatch)
});

RoleMenuDetailContainer = connect(
  mapStateToProps, mapDispatchToProps
)(RoleMenuDetailContainer);

export default RoleMenuDetailContainer;