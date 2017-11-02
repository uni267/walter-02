import React, { Component } from "react";

// router
import { withRouter } from "react-router-dom";

// store
import { connect } from "react-redux";

// actions
import {
  requestChangePassword,
  toggleChangePasswordDialog,
  logout,
  triggerSnackbar
} from "../actions";

// material icons
import ActionLabel from "material-ui/svg-icons/action/label";
import ActionVerifiedUser from "material-ui/svg-icons/action/verified-user";
import ActionList from "material-ui/svg-icons/action/list";
import ActionDonutSmall from "material-ui/svg-icons/action/donut-small";
import SocialPerson from "material-ui/svg-icons/social/person";
import SocialGroup from "material-ui/svg-icons/social/group";
import ActionDescription from "material-ui/svg-icons/action/description";

// components
import AccountDialog from "../components/Account/AccountDialog";
import AppMenu from "../components/AppMenu";
import AppNavBar from "../components/AppNavBar";

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleMenu: {
        open: false
      }
    };
  }

  toggleAppMenu = () => {
    this.setState({
      roleMenu: {
        open: !this.state.roleMenu.open
      }
    });
  };

  handleLogout = () => {
    this.props.logout();
    this.props.history.push("/login");
  };

  render() {
    const menus = [
      {
        name: "ファイル一覧",
        link: `/home/${this.props.tenant.dirId}`,
        icon: <ActionList />
      },
      {
        name: "タグ管理",
        link: `/tags`,
        icon: <ActionLabel />
      },
      {
        name: "容量管理",
        link: `/analysis`,
        icon: <ActionDonutSmall />
      },
      {
        name: "ユーザ管理",
        link: "/users",
        icon: <SocialPerson />
      },
      {
        name: "グループ管理",
        link: "/groups",
        icon: <SocialGroup />
      },
      {
        name: "ロール管理",
        link: "/roles",
        icon: <ActionVerifiedUser />
      },
      {
        name: "メタ情報管理",
        link: "/meta_infos",
        icon: <ActionDescription />
      }
    ];

    const appTitle = "cloud storage";

    return (
      <div>
        <AppNavBar
          appTitle={appTitle}
          notifications={this.props.notifications}
          handleAccountOpen={this.props.toggleChangePasswordDialog}
          handleLogout={this.handleLogout}
          toggleMenu={this.toggleAppMenu}
          tenant={this.props.tenant}
          session={this.props.session} />

        <AppMenu
          open={this.state.roleMenu.open}
          menus={menus}
          toggle={this.toggleAppMenu}
          />

        <AccountDialog
          changePasswordStore={this.props.changePassword}
          handleClose={this.props.toggleChangePasswordDialog}
          requestChangePassword={this.props.requestChangePassword} />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications,
    changePassword: state.changePassword,
    tenant: state.tenant,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestChangePassword: (current_password, new_password) => {
    dispatch(requestChangePassword(current_password, new_password));
  },
  toggleChangePasswordDialog: () => { dispatch(toggleChangePasswordDialog()); },
  logout: () => { dispatch(logout()); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); }
});

NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer);

export default withRouter(NavigationContainer);
