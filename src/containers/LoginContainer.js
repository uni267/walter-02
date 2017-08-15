import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

// containers
import NavigationContainer from "./NavigationContainer";

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
  },

  circular: {
    position: "absolute",
    paddingTop: "30%",
    width: "100%",
    height: "100%",
    zIndex: 1000,
    backgroundColor: "#ddd",
    opacity: 0.5,
    textAlign: "center"
  }
};

class LoginContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.session.login) {
      this.props.history.push("/home");
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
    const circular = this.props.session.start
          ? <CircularProgress size={90} thickness={6} style={styles.circular} />
          : null;

    return (
      <div>
        {circular}

        <NavigationContainer />

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
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
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
