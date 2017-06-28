import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconButton from "material-ui/IconButton";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";
import AddFileDialog from "./AddFileDialog";

class FileAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
      snack: {
        open: false,
        message: " ",
        hide_duration: 3000,
      }
    };

    this.handleOpen = this.handleOpen.bind(this);    
    this.handleClose = this.handleClose.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.debug = this.debug.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({
      open: false,
      files: [],
    });
  }

  handleUpload = () => {
    this.setState({
      open: false,
    });

    this.props.addFiles(this.state.files);
    this.setState({
      snack: {
        open: true,
        message: "file uploaded",
      }
    });
    this.setState({ files: [] });
  }

  onDrop = (files) => {
    let _files = this.state.files.slice();
    files.forEach(f => _files.push({ name: f.name }));
    this.setState({ files: _files });
  }

  debug = () => {
    this.setState({snack: {open: true, message: "foobar"}});
  }

  render() {
    const upload_button = <IconButton><FileCloudUpload /></IconButton>;
    const create_folder_button = <IconButton><FileCreateNewFolder /></IconButton>;

    return (
      <div className="file-action">
        <BottomNavigation>
          <BottomNavigationItem 
            label="upload" 
            icon={upload_button}
            onTouchTap={this.handleOpen}
          />
          <BottomNavigationItem
            label="create"
            icon={create_folder_button}
            onTouchTap={this.debug}
          />
        </BottomNavigation>

        <AddFileDialog
          files={this.state.files}
          open={this.state.open}
          handleClose={this.handleClose}
          handleUpload={this.handleUpload}
          onDrop={this.onDrop}
        />
        <Snackbar
          open={this.state.snack.open}
          message={this.state.snack.message}
          autoHideDuration={3000}
          onRequestClose={() => this.setState({
            snack: {
              open: false
            }
          })}
        />
      </div>
    );
  }
};

export default FileAction;
