import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import Tag from "../Tag";

import {
  requestFetchFile,
  triggerSnackbar,
  requestAddTag,
  requestDelTag,
  requestFetchTags
} 
from "../../actions";

class TagFileDialog extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.props.requestFetchFile(nextProps.file._id);
      this.props.requestFetchTags();
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
          tags={this.props.tags}
          requestDelTag={this.props.requestDelTag}
          requestAddTag={this.props.requestAddTag}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    fetchedFile: state.file,
    tags: state.tags
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchFile: (file_id) => { dispatch(requestFetchFile(file_id)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  requestDelTag: (file, tag) => { dispatch(requestDelTag(file, tag)); },
  requestAddTag: (file, value) => { dispatch(requestAddTag(file, value)); },
  requestFetchTags: () => { dispatch(requestFetchTags()); }
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
