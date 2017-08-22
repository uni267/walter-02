import React, { Component } from "react";

// store
import { connect } from "react-redux";

// actions
import { 
  requestChangePassword,
  toggleChangePasswordDialog
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

  render() {
    return (
      <div>
        <AppNavBar
          appTitle={appTitle}
          notifications={this.props.notifications}
          handleAccountOpen={this.props.toggleChangePasswordDialog}
          toggleMenu={this.toggleAppMenu} />

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
    changePassword: state.changePassword
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestChangePassword: (current_password, new_password) => {
    dispatch(requestChangePassword(current_password, new_password));
  },
  toggleChangePasswordDialog: () => { dispatch(toggleChangePasswordDialog()); }
});

NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer);

export default NavigationContainer;
