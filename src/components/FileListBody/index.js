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
    this.moveFile = this.moveFile.bind(this);
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

  moveFile(dir_id, file_id) {
    this.props.moveFile(file_id, dir_id);
    this.props.triggerSnackbar("ファイルを移動しました");
  };

  renderRow(file, idx) {
    const dir_component = (
      <Dir key={idx} dir={file} />
    );

    const file_component = (
      <File key={idx}
            dir_id={this.props.dir_id}
            file={file}
            moveFile={this.moveFile}
            deleteFile={this.props.deleteFile}
            editFile={this.props.editFile}
            triggerSnackbar={this.props.triggerSnackbar}
            toggleStar={this.props.toggleStar} />
    );

    return file.is_dir ? dir_component : file_component;
  }

  render() {
    const { FILE } = NativeTypes;
    return (
      <TableBodyWrapper
        accepts={[FILE]}
        onDrop={this.handleFileDrop}>
        {this.props.files.map((file, idx) => this.renderRow(file, idx))}
      </TableBodyWrapper>
    );
  }
}

export default withDragDropContext(FileListBody);
