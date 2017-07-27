import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import Logo from "../components/Logo/";

class NavigationContainer extends Component {
  render() {
    return (
      <div>
        <Logo notifications={this.props.notifications} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
});

NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer);

export default NavigationContainer;
