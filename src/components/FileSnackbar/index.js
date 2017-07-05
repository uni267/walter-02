import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";

class FileSnackbar extends Component {
  render() {
    return (
      <Snackbar
        open={false}
        message={"foobar"}
        autoHideDuration={3000}
        onRequestClose={() => this.setState({snack: {open: false}})}
        />
    );    
  }
}

export default FileSnackbar;
