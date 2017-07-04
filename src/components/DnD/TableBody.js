import React, { Component } from "react";
import withDragDropContext from "./withDragDropContext";
import Dir from "./Dir";
import File from "./File";

class TableBody extends Component {
  render() {
    const { files, onDeleteClick, onDeleteDone } = this.props;

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
            onDeleteDone={onDeleteDone} />
        );
      }
    };

    return (
      <div>
        {files.map((file, idx) => renderRow(file, idx))}
      </div>
    );
  }
}

export default withDragDropContext(TableBody);
