import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import Tag from "../Tag";

import { requestFetchFile, triggerSnackbar } from "../../actions";

class TagFileDialog extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.props.requestFetchFile(nextProps.file._id);
    }
  }

  render() {
    const actions = (
      <FlatButton
        label="close"
        primary={true}
        onTouchTap={this.props.handleClose}
        />
    );

    return (
      <Dialog
        title="タグ編集"
        open={this.props.open}
        modal={false}
        actions={actions} >

        <Tag 
          file={this.props.fetchedFile}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    fetchedFile: state.file
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchFile: (file_id) => { dispatch(requestFetchFile(file_id)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); }
});

TagFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  file: PropTypes.object
};

TagFileDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFileDialog);

export default TagFileDialog;
