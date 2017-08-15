import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class AuthenticationContainer extends Component {

  componentWillMount() {
    const { login, user_id } = this.props.session;
    if (!login && user_id === null) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
  };
};

AuthenticationContainer = connect(mapStateToProps)(AuthenticationContainer);

export default withRouter(AuthenticationContainer);
