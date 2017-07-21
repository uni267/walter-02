import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material grid
import { Card } from 'material-ui/Card';

// components
import FileActionContainer from "./FileActionContainer";
import FileSearch from "../components/FileSearch";
import DirBox from "../components/DirBox";
import FileListHeader from "../components/FileListHeader";
import FileListBodyContainer from "./FileListBodyContainer";
import FileSnackbar from "../components/FileSnackbar";

// actions
import {
  searchFile,
  setSortTarget,
  toggleSortTarget,
  sortFile,
  triggerSnackbar,
  closeSnackbar
} from "../actions";

const styles = {
  row: {
    display: "flex"
  }
};

class FileBoxContainer extends Component {

  dirRoute = (dir) => {
    let result = [];

    const walk = (dir) => {
      if (Number(dir.id) === 0) {
        result = [{ id: 0 }];
        return;
      }

      const dirs = this.props.dirs.slice();
      const target = dirs
            .filter(d => d.descendant === Number(dir.id) && d.depth === 1)[0];

      // top node
      if (target.ancestor === 0) {
        result = [{ id: target.descendant }, ...result];
        result = [{ id: target.ancestor }, ...result];
        return;
      } else {
        result = [{ id: target.descendant }, ...result];
        walk({ id: target.ancestor });
      }

    };

    walk(dir);
    return result;
  };

  addDirName = (dir) => {
    return this.props.allFiles.filter(file => dir.id == file.id)[0];
  };

  render() {
    let _files = this.props.files.slice();

    if (this.props.searchWord.value.trim() !== '') {
      const re = new RegExp(this.props.searchWord.value);

      _files = this.props.files.filter(file => {
        return file.name.match(re) !== null ||
          file.modified.match(re) !== null;
      }).filter(file => file.is_display);
    }

    const dirs = this.dirRoute({ id: this.props.dir_id })
        .map(this.addDirName);

    return (
      <Card>
        <div style={{display: "flex"}}>
          <div style={{width: "40%"}}>
            <DirBox dirs={dirs} />
          </div>

          <div style={{width: "60%"}}>
            <FileSearch
              searchWord={this.props.searchWord}
              searchFile={this.props.searchFile} />
          </div>
        </div>

        <div style={{display: "flex"}}>
          <div style={{width: "78%"}}>
            <FileListHeader
              setSortTarget={this.props.setSortTarget}
              toggleSortTarget={this.props.toggleSortTarget}
              fileSortTarget={this.props.fileSortTarget} 
              sortFile={this.props.sortFile} />

            <FileListBodyContainer
              dir_id={this.props.dir_id}
              files={_files} />

            <FileSnackbar
              closeSnackbar={this.props.closeSnackbar}
              snackbar={this.props.snackbar} />
          </div>

          <div style={{width: "22%"}}>
            <FileActionContainer dir_id={this.props.dir_id} />
          </div>

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
  searchFile: (keyword) => { dispatch(searchFile(keyword)); },
  setSortTarget: (target) => { dispatch(setSortTarget(target)); },
  toggleSortTarget: () => { dispatch(toggleSortTarget()); },
  sortFile: (sorted, desc) => { dispatch(sortFile(sorted, desc)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  closeSnackbar: () => { dispatch(closeSnackbar()); }
});

FileBoxContainer = connect(mapStateToProps, mapDispatchToProps)(FileBoxContainer);
export default FileBoxContainer;
