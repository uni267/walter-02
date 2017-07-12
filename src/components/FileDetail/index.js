import React, { Component } from "react";

class FileDetail extends Component {
  render() {
    const { file } = this.props;

    return (
      <div>
        {file.name}
      </div>
    );
  }
}

export default FileDetail;
