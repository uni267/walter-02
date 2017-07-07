import React, { Component } from "react";

// DnD
import withDragDropContext from "./withDragDropContext";
import { NativeTypes } from 'react-dnd-html5-backend';

// app components
import TableBodyWrapper from "./TableBodyWrapper";
import Dir from "../Dir";
import File from "../File";

class FileListBody extends Component {
  constructor(props) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(item, monitor) {
    if (monitor) {
      const droppedFiles = monitor.getItem().files;
      droppedFiles.forEach(file => {
        this.props.addFile(this.props.dir_id, file.name);
        this.props.triggerSnackbar(`${file.name}をアップロードしました`);
      });
    }
  }

  render() {
    const renderRow = (file, idx) => {
      return file.is_dir 
        ? <Dir key={idx} dir={file} />
        : <File key={idx} dir_id={this.props.dir_id} file={file} moveFile={moveFile} />;
    };

    const { FILE } = NativeTypes;

    const moveFile = (dir_id, file_id) => {
      this.props.moveFile(file_id, dir_id);
      this.props.triggerSnackbar("ファイルを移動しました");
    };

    return (
      <TableBodyWrapper
        accepts={[FILE]}
        onDrop={this.handleFileDrop}>
        {this.props.files.map((file, idx) => renderRow(file, idx))}
      </TableBodyWrapper>
    );
  }
}

export default withDragDropContext(FileListBody);
