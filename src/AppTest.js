import React, { Component } from "react";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { connect } from "react-redux";

// action

const SEND = "SEND";

const send = (value) => {
  return {
    type: SEND,
    value
  };
};

// container
class FormApp extends Component {
  render() {
    return (
      <div>
        <FormInput handleClick={this.props.onClick} />
        <FormDisplay data={this.props.value} />
      </div>
    );
  }
}

// presentation
class FormInput extends Component {
  send(e) {
    e.preventDefault();
    this.props.handleClick(this.myInput.value.trim());
    this.myInput.value = "";
    return;
  }

  render() {
    return (
      <form>
        <input type="text" ref={ ref => (this.myInput = ref) } defaultValue="foo" />
          <button onClick={ e => this.send(e) }> send </button>
      </form>
    );
  }
}

class FormDisplay extends Component {
  render() {
    return (
      <div>{this.props.data}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    value: state.value
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick(value) {
      dispatch(send(value));
    }
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(FormApp);
export default AppContainer;
