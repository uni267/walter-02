import React, { Component } from "react";

// material
import Menu from "material-ui/Menu";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";

class FileActionContainer extends Component {

  render() {
    const dir_id = this.props;
    return (
      <div>
        <Menu>
          <AddFileDialog dir_id={dir_id}/>
          <AddDirDialog dir_id={dir_id} />
        </Menu>
      </div>
    );
  }

}

export default FileActionContainer;
