import React, { Component } from "react";

// store
import { connect } from "react-redux";

// containers
import NavigationContainer from "./NavigationContainer";

// components
import FileDetail from "../components/FileDetail";

class FileDetailContainer extends Component {
  render() {
    return (
      <div>
        <NavigationContainer />
        <FileDetail file={this.props.file} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    file: state.files.filter(f => f.id === Number(ownProps.match.params.id))[0]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({

});

FileDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDetailContainer);

export default FileDetailContainer;
