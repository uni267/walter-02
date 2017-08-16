import React, { Component } from "react";
import { withRouter, Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

class AuthenticationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }

  componentWillMount() {
    this.userWillTransfer();
  }

  componentWillUpdate(nextProps) {
    this.userWillTransfer();
  }

  userWillTransfer() {
    const { login, user_id } = this.props.session;
    const token = localStorage.getItem("token");

    if (!login && !token && user_id === null) {
      this.setState({ isAuth: false });
    } else {
      this.setState({ isAuth: true });
    }
  }

  render() {
    return (
      this.state.isAuth ? (
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

AuthenticationContainer = connect(mapStateToProps)(AuthenticationContainer);

export default withRouter(AuthenticationContainer);

