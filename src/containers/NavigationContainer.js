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
    return (
      <div>
        <Logo
          onAccountClick={this.props.onAccountClick}
          onMenuIconClick={this.props.onMenuIconClick}
          notifications={this.props.notifications} />

        <AppMenu open={this.props.appMenu.open} />

        <Account 
          account={this.props.account}
          onAccountClick={this.props.onAccountClick} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appMenu: state.appMenu,
    account: state.account,
    notifications: state.notifications
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
