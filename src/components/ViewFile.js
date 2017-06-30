import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import IconButton from 'material-ui/IconButton';
import FlatButton from "material-ui/FlatButton";
import ActionInfo from 'material-ui/svg-icons/action/info';

class ViewFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="close"
        primary={true}
        onTouchTap={() => this.setState({ open: false })}
      />
    ];

    return (
      <span className="view-file">
        <IconButton
          tooltip="詳細"
          iconStyle={this.props.styles.smallIcon}
          style={this.props.styles.small}
          onTouchTap={() => { this.setState({open: true}) }}
        >
          <ActionInfo />
        </IconButton>

        <Dialog
          title="ファイル詳細"
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false}) }
        >
        {this.props.file.name}
        </Dialog>
      </span>
    );
  }
}

export default ViewFile;
