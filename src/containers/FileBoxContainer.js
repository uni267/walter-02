import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material ui
import { Card } from 'material-ui/Card';

// components
import FileActionContainer from "./FileActionContainer";
import FileSearch from "../components/FileSearch";
import DirBox from "../components/DirBox";
import FileListContainer from "./FileListContainer";
import FileSnackbar from "../components/FileSnackbar";

// actions
import {
  triggerSnackbar,
  closeSnackbar,
  searchFile,
  requestFetchFiles
} from "../actions";

class FileBoxContainer extends Component {
  componentWillMount() {
    this.props.requestFetchFiles(this.props.dir_id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dir_id !== nextProps.dir_id) {
      this.props.requestFetchFiles(nextProps.dir_id);
    }
  }

  render() {
    return (
      <Card>
        <div style={{display: "flex"}}>
          <div style={{width: "40%"}}>
            <DirBox
              dirId={this.props.dir_id}
              dirs={this.props.dirs} />
          </div>

          <div style={{width: "60%"}}>
            <FileSearch
              searchWord={this.props.searchWord}
              searchFile={this.props.searchFile} />
          </div>
        </div>

        <div style={{display: "flex"}}>
          <div style={{width: "78%"}}>

            <FileListContainer
              dir_id={this.props.dir_id}
              history={this.props.history}
              files={this.props.files} />

          </div>

          <div style={{width: "22%"}}>
            <FileActionContainer dir_id={this.props.dir_id} />
          </div>

          <FileSnackbar
            closeSnackbar={this.props.closeSnackbar}
            snackbar={this.props.snackbar} />

        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    snackbar: state.snackbar,
    searchWord: state.searchFile,
    fileSortTarget: state.fileSortTarget,
    files: state.files,
    dirs: state.dirs,
    session: state.session,
    loading: state.loading
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  closeSnackbar: () => { dispatch(closeSnackbar()); },
  searchFile: (value) => { dispatch(searchFile(value)); },
  requestFetchFiles: (dir_id) => { dispatch(requestFetchFiles(dir_id)); }
});

FileBoxContainer = connect(mapStateToProps, mapDispatchToProps)(FileBoxContainer);

FileBoxContainer.propTypes = {
  dir_id: PropTypes.string
};

export default FileBoxContainer;
