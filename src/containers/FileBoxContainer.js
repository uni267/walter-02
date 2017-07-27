import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material grid
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
  closeSnackbar
} from "../actions";


class FileBoxContainer extends Component {

  render() {
    let _files = this.props.files.slice();

    if (this.props.searchWord.value.trim() !== '') {
      const re = new RegExp(this.props.searchWord.value);

      _files = this.props.files.filter(file => {
        return file.name.match(re) !== null ||
          file.modified.match(re) !== null;
      }).filter(file => file.is_display);
    }

    return (
      <Card>
        <div style={{display: "flex"}}>
          <div style={{width: "40%"}}>
            <DirBox
              allFiles={this.props.allFiles}
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
              files={_files} />

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
    files: state.files.filter(f => f.is_display)
      .filter(f => Number(f.dir_id) === Number(ownProps.dir_id)),
    allFiles: state.files,
    dirs: state.dirs
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  closeSnackbar: () => { dispatch(closeSnackbar()); }
});

FileBoxContainer = connect(mapStateToProps, mapDispatchToProps)(FileBoxContainer);

FileBoxContainer.propTypes = {
  dir_id: PropTypes.number
};

export default FileBoxContainer;
