import React, { Component } from "react";

// material
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import ActionDelete from "material-ui/svg-icons/action/delete";

class DeleteIcon extends Component {
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
        label="Delete"
        primary={true}
        onTouchTap={(e) => {
          this.props.deleteFile(this.props.file);
          this.setState({ open: false });
          this.props.triggerSnackbar(`${this.props.file.name}を削除しました`);
        }}
      />,
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ open: false })}
      />
    ];

    return (
      <div>
        <IconButton onClick={() => this.setState({open: true})}>
          <ActionDelete />
        </IconButton>
        <Dialog
          title={`${this.props.file.name}を削除しますか？`}
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}
        >
        </Dialog>

      </div>
    );
  }
}

export default DeleteIcon;
