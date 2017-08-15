import React, { Component } from "react";

// store
import { connect } from "react-redux";

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
      },
      account: {
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

  toggleAccount = () => {
    this.setState({
      account: { open: !this.state.account.open }
    });
  };

  render() {
    return (
      <div>
        <AppNavBar
          appTitle={appTitle}
          notifications={this.props.notifications}
          handleAccountOpen={this.toggleAccount}
          toggleMenu={this.toggleAppMenu} />

        <AppMenu
          open={this.state.menu.open}
          menus={menus}
          toggle={this.toggleAppMenu}
          />

        <AccountDialog
          open={this.state.account.open}
          handleClose={this.toggleAccount} />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
});

NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer);

export default NavigationContainer;
