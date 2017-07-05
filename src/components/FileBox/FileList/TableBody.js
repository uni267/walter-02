import React, { Component } from "react";

// DnD
import withDragDropContext from "./withDragDropContext";
import { NativeTypes } from 'react-dnd-html5-backend';

// store
import { connect } from "react-redux";

// app components
import TableBodyWrapper from "./TableBodyWrapper";
import Dir from "./Dir";
import File from "./File";

// datetime
import moment from "moment";

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(item, monitor) {
    if (monitor) {
      const droppedFiles = monitor.getItem().files;
      this.props.addFiles(droppedFiles.map(file => {
        return {
          name: file.name,
          modified: moment().format("YYYY-MM-DD HH:mm"),
          dir_id: 0,
          is_dir: false,
          is_display: true
        };
      }));
      this.props.addFilesDone();
    }
  }

  render() {
    const {
      onDeleteClick,
      onDeleteDone,
      moveFile,
      onMoveDone
    } = this.props;

    const files = this.props.state.files;

    const renderRow = (file, idx) => {
      if (file.is_dir) {
        return (
          <Dir key={idx} dir={file}
               onDeleteClick={onDeleteClick}
               onDeleteDone={onDeleteDone} />
        );
      }
      else {
        return (
          <File key={idx} file={file}
                onDeleteClick={onDeleteClick}
                onDeleteDone={onDeleteDone}
                moveFile={moveFile}
                onMoveDone={onMoveDone} />
        );
      }
    };

    const { FILE } = NativeTypes;

    return (
      <TableBodyWrapper
        accepts={[FILE]}
        onDrop={this.handleFileDrop}>
        {files.map((file, idx) => renderRow(file, idx))}
      </TableBodyWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {state};
};

TableBody = connect(mapStateToProps)(TableBody);
export default withDragDropContext(TableBody);
