import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import Tag from "../Tag";

import * as FileActions from "../../actions/files";

class TagFileDialog extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.props.actions.requestFetchFile(nextProps.file._id);
      this.props.actions.requestFetchTags();
    }
  }

  render() {
    const actions = (
      <FlatButton
        label="close"
        primary={true}
        onTouchTap={this.props.actions.toggleFileTagDialog}
        />
    );

    return (
      <Dialog
        title="タグ編集"
        open={this.props.open}
        modal={false}
        actions={actions} >

        <Tag 
          { ...this.props }
          file={this.props.fetchedFile}
          tags={this.props.tags}
          />

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
  actions: bindActionCreators(FileActions, dispatch)
});

TagFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  file: PropTypes.object
};

TagFileDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFileDialog);

export default TagFileDialog;
