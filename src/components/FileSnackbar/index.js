import React, { Component } from "react";

// material
import Snackbar from "material-ui/Snackbar";

class FileSnackbar extends Component {
  render() {
    return (
      <Snackbar
        open={this.props.snackbar.open}
        message={this.props.snackbar.message}
        autoHideDuration={this.props.snackbar.duration}
        onRequestClose={this.props.closeSnackbar} />
    );    
  }
}

export default FileSnackbar;

