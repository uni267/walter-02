import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from 'material-ui/RaisedButton';

// containers
import NavigationContainer from "./NavigationContainer";

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
  login = () => {
    const name = this.refs.name.getValue();
    const password = this.refs.password.getValue();
    console.log(name, password);
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.login();
    }
    return false;
  };

  render() {
    return (
      <div>
        <NavigationContainer />

        <div style={styles.wrapper}>
          <Card style={styles.card}>
            <CardTitle title={"login"} />

            <CardText>

              <TextField
                ref="name" 
                onKeyDown={this.handleKeyDown}
                hintText="example@foobar.com"
                floatingLabelText="ユーザID"
                style={styles.text} />

              <br />

              <TextField
                ref="password"
                onKeyDown={this.handleKeyDown}
                floatingLabelText="パスワード"
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
  
});

LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);

export default LoginContainer;
