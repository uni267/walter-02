import React, { Component } from "react";
import ViewFile from "./ViewFile";
import EditFile from "./EditFile";
import DeleteFile from "./DeleteFile";

class FileListAction extends Component {
  render() {
    const { file, onDeleteClick, onDeleteDone } = this.props;

    const styles = {
      smallIcon: {
        width: 24,
        height: 24
      },
      small: {
        width: 42,
        height: 42,
        padding: 4
      }
    }

    return (
      <div className="file-list-action">
        <ViewFile
          file={file}
          styles={styles}
        />

        <EditFile
          file={file}
          styles={styles}
        />

        <DeleteFile
          file={file}
          onDeleteClick={onDeleteClick}
          deleteDone={onDeleteDone}
          styles={styles}
        />

      </div>
    );
  }
}

export default FileListAction;
