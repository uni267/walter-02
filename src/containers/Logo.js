import React, { Component } from "react";

// store
import { connect } from "react-redux";

import Logo from "../components/Logo";
import AppMenu from "../components/AppMenu";

class LogoContainer extends Component {
  render() {
    const { menu } = this.props;
    return (
      <div>
        <Logo />
        <AppMenu open={menu.open} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.app_menu
  };
};

LogoContainer = connect(mapStateToProps)(LogoContainer);
export default LogoContainer;
