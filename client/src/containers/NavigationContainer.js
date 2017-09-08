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

// components
import AccountDialog from "../components/Account/AccountDialog";
import AppMenu from "../components/AppMenu";
import AppNavBar from "../components/AppNavBar";

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {
        open: false
      }
    };
  }

  toggleAppMenu = () => {
    this.setState({
      menu: {
        open: !this.state.menu.open
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
        link: `/home/${this.props.tenant.dirId}`
      },
      {
        name: "容量管理",
        link: `/home/${this.props.tenant.dirId}`
      },
      {
        name: "ユーザ管理",
        link: "/users"
      },
      {
        name: "グループ管理",
        link: "/groups"
      },
      {
        name: "ロール管理",
        link: "/roles"
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
          tenant={this.props.tenant} />

        <AppMenu
          open={this.state.menu.open}
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
    tenant: state.tenant
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
