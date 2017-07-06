import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

class AddDirDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const handleCreate = (e) => {
      e.preventDefault();
      const dir_name = this.refs.dirName.getValue();
      if (dir_name === "") this.setState({ open: false });

      this.props.dispatch({
        type: "ADD_DIR",
        name: dir_name,
        dir_id: this.props.dir_id.dir_id
      });

      this.setState({ open: false });
      this.props.dispatch({
        type: "TRIGGER_SNACK",
        message: `${dir_name}を作成しました`
      });

    };

    const actions = [
        <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={() => this.setState({ open: false })}
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
          onTouchTap={() => this.setState({ open: true})}
          />

          <Dialog
            title="フォルダを作成"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.setState({ open: false })}
            >
            <TextField
              ref="dirName"
              hintText=""
              floatingLabelText="フォルダ名"
              />
          </Dialog>
      </div>
    );
  }
}

AddDirDialog = connect()(AddDirDialog);
export default AddDirDialog;
