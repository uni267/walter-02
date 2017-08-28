import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

// actions
import { moveDir, toggleMoveDirDialog } from "../../actions";

class MoveDirDialog extends Component {
  render() {
    const actions = [
      (
        <FlatButton
          label="移動"
          onTouchTap={() => {
            const destinationDir = this.props.dirTree.selected;
            const movingDir = this.props.dirTree.move_dir;
            this.props.moveDir(destinationDir, movingDir);
          }}
          primary={true}
          />
      ),
      (
        <FlatButton
          label="close"
          onTouchTap={this.props.toggleMoveDirDialog}
          />
      )
    ];

    return (
      <Dialog
        title="フォルダを移動"
        open={this.props.dirTree.moveDirDialogOpen}
        modal={false}
        autoScrollBodyContent={true}
        onRequestClose={this.props.toggleMoveDirDialog}
        bodyStyle={{ backgroundColor: "rgb(240, 240, 240)" }}
        actions={actions} >

        <DirTreeContainer />

      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dirTree: state.dirTree
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  moveDir: (destinationDir, movingDir) => {
    dispatch(moveDir(destinationDir, movingDir));
  },
  toggleMoveDirDialog: (dir) => { dispatch(toggleMoveDirDialog(dir)); }
});

MoveDirDialog = connect(mapStateToProps, mapDispatchToProps)(MoveDirDialog);

export default MoveDirDialog;
