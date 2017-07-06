import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import Menu from "material-ui/Menu";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";

// actions
import { toggleAddDir, createDir, triggerSnackbar } from "../actions";

class FileActionContainer extends Component {

  render() {
    return (
      <div>
        <Menu>
          <AddFileDialog dir_id={this.props.dir_id}/>
          <AddDirDialog
            dir_id={this.props.dir_id}
            toggleAddDir={this.props.toggleAddDir}
            createDir={this.props.createDir}
            open={this.props.open}
            triggerSnackbar={this.props.triggerSnackbar}
            />
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    open: state.add_dir.open
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleAddDir: () => { dispatch(toggleAddDir()) },
  createDir: (dir_name) => { dispatch(createDir(ownProps.dir_id, dir_name)) },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)) }
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

export default FileActionContainer;
