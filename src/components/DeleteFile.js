import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import IconButton from 'material-ui/IconButton';
import FlatButton from "material-ui/FlatButton";
import ActionDelete from 'material-ui/svg-icons/action/delete';

class DeleteFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={() => this.setState({ open: false })}
      />,
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ open: false })}
      />
    ];

    return (
      <span className="delete-file">
        <IconButton
          tooltip="削除"
          iconStyle={this.props.styles.smallIcon}
          style={this.props.styles.small}
          onTouchTap={() => { this.setState({open: true}) }}
        >
          <ActionDelete />
        </IconButton>

        <Dialog
          title="ファイル削除"
          modal={false}
          actions={actions}
          open={this.state.open}
        >
        </Dialog>
      </span>
    );
  }
}

export default DeleteFile;
