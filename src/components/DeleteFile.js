import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import IconButton from 'material-ui/IconButton';
import FlatButton from "material-ui/FlatButton";
import ActionDelete from 'material-ui/svg-icons/action/delete';

class DeleteFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

  }

  render() {
    const { file, onDeleteClick, deleteDone, styles } = this.props;

    const actions = [
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={(e) => {
          this.setState({ open: false });
          deleteDone(file);
          onDeleteClick(e, file);
        }}
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
          iconStyle={styles.smallIcon}
          style={styles.small}
          onTouchTap={() => { this.setState({open: true}) }}
        >
          <ActionDelete />
        </IconButton>

        <Dialog
          title={`${file.name}を削除しますか？`}
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}
        >
        </Dialog>

      </span>
    );
  }
}

export default DeleteFile;
