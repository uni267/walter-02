import React, { Component } from "react";
import PropTypes from "prop-types";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

// components
import Authority from "../Authority";

class AddDirDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addAuthority: { open: false }
    };
  }

  onCreateClick = (e) => {
    e.preventDefault();
    const dir_name = this.refs.dirName.getValue();
    this.props.createDir(dir_name);
  };

  renderCreateDirDialog = () => {
    const actions = [
      (
        <FlatButton
          label="Cancel"
          onTouchTap={this.props.toggleCreateDir}
          />
      ),
      (
        <FlatButton
          label="Create"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.onCreateClick}
          />
      )
    ];
    
    return (
      <Dialog
        title="フォルダを作成"
        actions={actions}
        modal={false}
        open={this.props.createDirState.open}
        onRequestClose={this.props.toggleCreateDir} >

        <TextField
          ref="dirName"
          hintText=""
          errorText={this.props.createDirState.errors.dirName}
          floatingLabelText="フォルダ名" />

      </Dialog>
    );
  };

  renderAddAuthorityDialog = () => {
    const actions = (
      <FlatButton
        label="閉じる"
        primary={true}
        onTouchTap={() => this.setState({ addAuthority: { open: false } })}
        />
    );

    // const createdDir = this.props.allDirs.slice().sort((a, b) => a.id < b.id)[0];

    return (
      <Dialog
        title="権限を変更"
        actions={actions}
        modal={true}
        open={this.state.addAuthority.open}
        onRequestClose={() => this.setState({ addAuthority: { open: false } })} >

        <Authority
          file={{}}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  };

  render() {
    return (
      <div>
        <MenuItem
          primaryText="新しいフォルダ"
          leftIcon={<FileCreateNewFolder />}
          onTouchTap={this.props.toggleCreateDir} />

          {this.renderCreateDirDialog()}
          {this.renderAddAuthorityDialog()}
      </div>
    );
  }
}

AddDirDialog.propTypes = {
  dir_id: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  addAuthority: PropTypes.func.isRequired,
  deleteAuthority: PropTypes.func.isRequired,
  createDir: PropTypes.func.isRequired,
  createDirTree: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired
};

export default AddDirDialog;
