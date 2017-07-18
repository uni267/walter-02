import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import DirTree from "../components/DirTree";

class DirTreeContainer extends Component {
  render() {
    return (
      <DirTree nodes={this.props.dirs} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dirs: state.dirs
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  
});

DirTreeContainer = connect(mapStateToProps, mapDispatchToProps)(DirTreeContainer);
export default DirTreeContainer;
