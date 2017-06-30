import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import IconButton from 'material-ui/IconButton';
import FlatButton from "material-ui/FlatButton";
import ImageEdit from "material-ui/svg-icons/image/edit";

class EditFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="save"
        primary={true}
        onTouchTap={() => this.setState({ open: false })}
      />,
      <FlatButton
        label="cancel"
        primary={false}
        onTouchTap={() => this.setState({ open: false })}
      />,
    ];

    return (
      <span className="edit-file">
        <IconButton
          tooltip="編集"
          iconStyle={this.props.styles.smallIcon}
          style={this.props.styles.small}
          onTouchTap={() => { this.setState({open: true}) }}
        >
          <ImageEdit />
        </IconButton>

        <Dialog
          title="ファイル編集"
          modal={false}
          actions={actions}
          open={this.state.open}
        >
        </Dialog>
      </span>
    );
  }
}

export default EditFile;
