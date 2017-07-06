import React, { Component } from "react";

// store
import { connect } from "react-redux";

import Logo from "../components/Logo/";
import AppMenu from "../components/AppMenu/";
import Account from "../components/Account/";

class LogoContainer extends Component {
  render() {
    const { menu, account } = this.props;
    return (
      <div>
        <Logo />
        <AppMenu open={menu.open} />
        <Account account={account} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.app_menu,
    account: state.account
  };
};

LogoContainer = connect(mapStateToProps)(LogoContainer);
export default LogoContainer;
