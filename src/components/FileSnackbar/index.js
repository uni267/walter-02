import React, { Component } from "react";

// material
import Snackbar from "material-ui/Snackbar";

// store
import { connect } from "react-redux";


class FileSnackbar extends Component {
  render() {
    const { state, dispatch } = this.props;
    return (
      <Snackbar
        open={state.open}
        message={state.message}
        autoHideDuration={state.duration}
        onRequestClose={() => {
          dispatch({
            type: "CLOSE_SNACK"
          });
        }}
      />
    );    
  }
}

FileSnackbar = connect()(FileSnackbar);
export default FileSnackbar;

