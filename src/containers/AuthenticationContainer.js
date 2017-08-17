import React, { Component } from "react";
import { withRouter, Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

import { requestLoginSuccess, putTenant } from "../actions";

class AuthenticationContainer extends Component {
  componentWillMount() {
    if (!this.props.session.login) this.userWillTransfer();
  }

  componentWillUpdate(nextProps) {
    if (!this.props.session.login) this.userWillTransfer();
  }

  userWillTransfer() {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("userId");
    const dir_id = localStorage.getItem("dirId");
    const tenant_name = localStorage.getItem("tenantName");

    if (token && user_id && dir_id && tenant_name) {
      this.props.putTenant(tenant_name, dir_id);
      this.props.requestLoginSuccess("success", user_id);
    }
  }

  render() {
    return (
      this.props.session.login ? (
        <Route children={this.props.children} />
      ) : (
        <Redirect to={'/login'} />
      )
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestLoginSuccess: (message, user_id) => {
    dispatch(requestLoginSuccess(message, user_id));
  },
  putTenant: (name, dirId) => {
    dispatch(putTenant(name, dirId));
  }
});

AuthenticationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationContainer);

export default withRouter(AuthenticationContainer);

