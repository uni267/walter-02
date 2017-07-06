import React, { Component } from "react";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

class AddDirDialog extends Component {
  render() {
    const handleCreate = (e) => {
      e.preventDefault();
      const dir_name = this.refs.dirName.getValue();

      if (dir_name === "") {
        this.props.toggleAddDir();
        return;
      }

      this.props.createDir(dir_name);
      this.props.toggleAddDir();
      this.props.triggerSnackbar(`${dir_name}を作成しました`);
    };

    const actions = [
        <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.props.toggleAddDir}
        />,

      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleCreate}
        />,
    ];

    return (
      <div>
        <MenuItem
          primaryText="新しいフォルダ"
          leftIcon={<FileCreateNewFolder />}
          onTouchTap={this.props.toggleAddDir} />

        <Dialog
          title="フォルダを作成"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.toggleAddDir} >
          <TextField
            ref="dirName"
            hintText=""
            floatingLabelText="フォルダ名" />
        </Dialog>
      </div>
    );
  }
}

export default AddDirDialog;
