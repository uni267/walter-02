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

const menus = [
  {name: "ファイル一覧"},
  {name: "管理コンソール"},
];

const appTitle = "cloud storage";

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
    localStorage.removeItem("userId");
    localStorage.removeItem("tenantName");
    localStorage.removeItem("dirId");
    localStorage.removeItem("token");
    this.props.logout();
    this.props.triggerSnackbar("ログアウトしました");
    this.props.history.push("/login");
  };

  render() {
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
