import React, { Component } from "react";
import PropTypes from "prop-types";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

// components
import Authority from "../FileDetail/Authority";

class AddDirDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addDir: { open: false },
      addAuthority: { open: false }
    };
  }

  onCreateClick = (e) => {
    e.preventDefault();
    const dir_name = this.refs.dirName.getValue();

    if (dir_name === "") {
      this.setState({ addDir: { open: false } });
      return;
    }

    this.props.createDir(dir_name);
    this.props.createDirTree({
      id: this.props.allDirs.sort( (a, b) => a.id < b.id )[0].id + 1
    });

    this.setState({ addDir: { open: false } });
    this.props.triggerSnackbar(`${dir_name}を作成しました`);
    this.setState({ addAuthority: { open: true } });
  };

  renderCreateDirDialog = () => {
    const actions = [
      (
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={() => this.setState({ addDir: { open: false } })}
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
        open={this.state.addDir.open}
        onRequestClose={() => this.setState({ addDir: { open: false } })} >

        <TextField
          ref="dirName"
          hintText=""
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

    const createdDir = this.props.allDirs.slice().sort((a, b) => a.id < b.id)[0];

    return (
      <Dialog
        title="権限を変更"
        actions={actions}
        modal={true}
        open={this.state.addAuthority.open}
        onRequestClose={() => this.setState({ addAuthority: { open: false } })} >

        <Authority
          file={createdDir}
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
          onTouchTap={() => this.setState({
            addDir: { open: true }
          })} />

          {this.renderCreateDirDialog()}
          {this.renderAddAuthorityDialog()}
      </div>
    );
  }
}

AddDirDialog.propTypes = {
  dir_id: PropTypes.number.isRequired,
  roles: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  addAuthority: PropTypes.func.isRequired,
  deleteAuthority: PropTypes.func.isRequired,
  allDirs: PropTypes.array.isRequired,
  createDir: PropTypes.func.isRequired,
  createDirTree: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired
};

export default AddDirDialog;
