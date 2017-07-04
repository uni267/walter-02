import React, { Component } from "react";
import withDragDropContext from "./withDragDropContext";
import { NativeTypes } from 'react-dnd-html5-backend';
import TableBodyWrapper from "./TableBodyWrapper";
import moment from "moment";
import Dir from "./Dir";
import File from "./File";

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
      files,
      onDeleteClick,
      onDeleteDone,
      moveFile,
      onMoveDone
    } = this.props;

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

export default withDragDropContext(TableBody);
