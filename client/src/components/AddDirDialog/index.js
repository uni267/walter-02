import React, { Component } from "react";
import PropTypes from "prop-types";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

// components
import Authority from "../Authority";

class AddDirDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addAuthority: { open: false }
    };
  }

  handleCreate = (e) => {
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
          onTouchTap={this.handleCreate}
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
          onKeyDown={e => e.key === "Enter" ? this.handleCreate() : null }
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
  triggerSnackbar: PropTypes.func.isRequired
};

export default AddDirDialog;
