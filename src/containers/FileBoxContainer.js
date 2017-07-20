import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material grid
import { Card } from 'material-ui/Card';

// components
import FileActionContainer from "./FileAction";
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

    this.props.dirs.slice()
      .sort( (a, b) => a.depth < b.depth)
      .filter(d => {
        return d.descendant === Number(dir.id) && d.depth !== 0;
      })
      .forEach(d => {
        result = [...result, { id: d.ancestor }];
        result = [...result, { id: d.descendant }];
      });

    return [
      ...result.filter(r => r.id !== Number(dir.id)),
      { id: Number(dir.id) }
    ];

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
          file.modified.match(re) !== null ||
          file.owner.match(re) !== null;
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
