import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

// datetime
import moment from "moment";

// app
import AddFileDialog from "./AddFileDialog";
import AddDirDialog from "./AddDirDialog";

class FileAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: {
        open: false,
        files: []
      },
      dir: {
        open: false
      }
    };

  }

  render() {
    const upload_button = <FileCloudUpload />;
    const create_folder_button = <FileCreateNewFolder />;

    const handleFileOpen = () => {
      this.setState({ file: { open: true, files: [] }});
    };

    const handleDirOpen = () => {
      this.setState({ dir: { open: true }});
    };

    const handleFileClose = () => {
      this.setState({ file: { open: false, files: [] }});
    };

    const handleDirClose = () => {
      this.setState({ dir: { open: false }});
    };

    const handleUpload = () => {
      this.setState({ file: { open: false }});
      this.state.files.forEach(file => {
        this.props.dispatch({
          type: "ADD_FILE",
          name: file.name,
          modified: file.modified,
          owner: file.owner,
          is_dir: file.is_dir,
          dir_id: file.dir_id,
          is_display: file.is_display
        });

        this.props.dispatch({
          type: "TRIGGER_SNACK",
          message: `${file.name}をアップロードしました`
        });
      });

      this.setState({ file: { files: [] }});
    };

    const handleDirCreate = (e) => {
      console.log(e);
    };

    const onDrop = (files) => {
      let _files = this.state.file.files.slice();

      files.forEach(f => {
        const push_file = {
          name: f.name,
          modified: moment().format("YYYY-MM-DD HH:mm"),
          owner: "user01",
          dir_id: Number(this.props.dir_id),
          is_dir: false,
          is_display: true
        };

        _files.push(push_file);
      });
      this.setState({ file: { files: _files }});
    };

    return (
      <div className="file-action">
        <Menu>
          <MenuItem
            primaryText="ファイルをアップロード" 
            leftIcon={upload_button}
            onTouchTap={handleFileOpen}
          />
          <MenuItem
            primaryText="新しいフォルダ"
            leftIcon={create_folder_button}
            onTouchTap={handleDirOpen}
          />
        </Menu>
        <AddFileDialog
          files={this.state.file.files}
          open={this.state.file.open}
          handleClose={handleFileClose}
          handleUpload={handleUpload}
          onDrop={onDrop}
        />
        <AddDirDialog
          open={this.state.dir.open}
          handleClose={handleDirClose}
          handleCreate={handleDirCreate}
        />
      </div>
    );
  }
};

FileAction = connect()(FileAction);
export default FileAction;
