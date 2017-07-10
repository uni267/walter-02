import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import EditorModeEdit from "material-ui/svg-icons/editor/mode-edit";
import TextField from "material-ui/TextField";

class EditIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

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
    };
  }

  render() {
    const actions = [
        <FlatButton
      label="save"
      primary={true}
      onTouchTap={(e) => {
        e.preventDefault();
        const file_name = this.refs.fileName.getValue();
        if ( file_name === "" ) {
          this.setState({ open: false });
          return;
        }

        let file = this.props.file;
        file.name = file_name;
        this.props.editFile(file);
        this.setState({ open: false });
        this.props.triggerSnackbar("ファイル名を変更しました");
      }}
        />,
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ open: false })}
        />
        ];

    const { file } = this.props;

    return (
      <div>
        <IconButton onClick={() => this.setState({open: true})}>
          <EditorModeEdit />
        </IconButton>
        <Dialog
          title="ファイル名を変更"
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false}) }
        >
          <TextField
            ref="fileName"
            defaultValue={this.props.file.name}
            floatingLabelText="ファイル名を変更" />
        </Dialog>

      </div>
    );
  }
}

export default EditIcon;
