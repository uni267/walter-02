import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import Logo from "../components/Logo/";
import AppMenu from "../components/AppMenu/";
import Account from "../components/Account/";

// actions
import { toggleAccount, toggleMenu } from "../actions";

class NavigationContainer extends Component {
  render() {
    const { menu, account, onAccountClick, onMenuIconClick } = this.props;

    return (
      <div>
        <Logo
          onAccountClick={onAccountClick}
          onMenuIconClick={onMenuIconClick} />
        <AppMenu open={menu.open} />
        <Account 
          account={account}
          onAccountClick={onAccountClick} />
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAccountClick: () => { dispatch(toggleAccount()) },
  onMenuIconClick: () => { dispatch(toggleMenu()) }
});

NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer);

export default NavigationContainer;
