import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// store
import { connect } from "react-redux";

// material ui
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from "material-ui/AppBar";

// actions
import { requestLogin } from "../actions";

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  text: {
    width: 330
  },

  card: {
    marginTop: 100,
    padding: 30
  },

  action: {
    textAlign: "center",
    marginTop: 30
  }
};

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      dirId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.session.login) {
      const dirId = nextProps.tenant.dirId;
      this.setState({ isAuth: true, dirId: dirId });
    }
  }

  login = () => {
    const name = this.refs.name.getValue();
    const password = this.refs.password.getValue();
    this.props.requestLogin(name, password);
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.login();
    }
    return false;
  };

  render() {
    return (
      this.state.isAuth ? (
        <Redirect to={`/home/?dir_id=${this.state.dirId}`} />
      ) : (
        <div>
          <AppBar title="cloud storage" />

          <div style={styles.wrapper}>
            <Card style={styles.card}>
              <CardTitle title={"Login"} />

              <CardText>

                <TextField
                  ref="name"
                  onKeyDown={this.handleKeyDown}
                  hintText="example@foobar.com"
                  floatingLabelText="ユーザID"
                  errorText={this.props.session.errors.name}
                  style={styles.text} />

                <br />

                <TextField
                  ref="password"
                  onKeyDown={this.handleKeyDown}
                  floatingLabelText="パスワード"
                  errorText={this.props.session.errors.password}
                  style={styles.text}
                  type="password" />

              </CardText>

              <CardActions style={styles.action}>
                <RaisedButton label="login" onTouchTap={this.login} />
              </CardActions>

            </Card>
          </div>

        </div>
      )
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestLogin: (name, password) => { dispatch(requestLogin(name, password)); }  
});

LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);

export default LoginContainer;
