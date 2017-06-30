import React, { Component } from "react";
import ViewFile from "./ViewFile";
import EditFile from "./EditFile";
import DeleteFile from "./DeleteFile";

class FileListAction extends Component {
  constructor(props) {
    super(props);

    this.styles = {
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

  }

  render() {
    return (
      <div className="file-list-action">
        <ViewFile styles={this.styles} />
        <EditFile styles={this.styles} />
        <DeleteFile styles={this.styles} />
      </div>
    );
  }
}

export default FileListAction;
