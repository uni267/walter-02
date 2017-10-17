import React, { Component } from "react";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// router
import { withRouter } from "react-router-dom";

// material
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

// material icons
import ActionDelete from "material-ui/svg-icons/action/delete";
import ContentContentCopy from "material-ui/svg-icons/content/content-copy";
import ContentContentCut from "material-ui/svg-icons/content/content-cut";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";
import MoveFileDialog from "../components/File/MoveFileDialog";
import DeleteAllFilesDialog from "../components/File/DeleteAllFilesDialog";

// actions
import * as FileActions from "../actions/files";

class FileActionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFile: {
        open: false
      }
    };
  }

  moveFiles = (files) => {
    this.props.actions.moveFiles(this.props.selectedDir, files);
  };

  render() {
    let items = [];

    // カレントフォルダに依存するmenuなので検索結果では表示することができない
    if (!this.props.isSearch) {
      items = 
        [ ...items,
          [
            (
              <MenuItem
                primaryText="アップロード"
                leftIcon={<FileCloudUpload />}
                onTouchTap={() => this.setState({ addFile: { open: true } })}
                />
            ),
            (
              <MenuItem
                primaryText="新しいフォルダ"
                leftIcon={<FileCreateNewFolder />}
                onTouchTap={() => this.props.actions.toggleCreateDir() }
                />
            ),
            (
              <MenuItem
                primaryText="ごみ箱"
                leftIcon={<ActionDelete />}
                onTouchTap={() => {
                  this.props.history.push(`/home/${this.props.tenant.trashDirId}`);
                }}
                />
            )
          ]
        ];
    }

    if (this.props.checkedFiles.length > 0) {
      items = [ ...items,
        [
          (
            <MenuItem
              primaryText="移動"
              onTouchTap={() => this.props.actions.toggleMoveFileDialog() }
              leftIcon={<ContentContentCut />}
              />
          ),
          (
            <MenuItem
              primaryText="コピー"
              leftIcon={<ContentContentCopy />}
              />
          ),
          (
            <MenuItem
              primaryText="削除"
              leftIcon={<ActionDelete />}
              onTouchTap={() => this.props.actions.toggleDeleteFilesDialog() }
              />
          )
        ]
      ];
    }
    return (
      <div style={{marginRight: 30}}>
        <Menu>
          {items.map( item => item )}
        </Menu>

        <AddFileDialog
          dir_id={this.props.match.params.id}
          open={this.state.addFile.open}
          closeDialog={() => this.setState({ addFile: { open: false } })}
          { ...this.props }
          />

          <AddDirDialog
            dir_id={this.props.dir_id}
            { ...this.props }
            />

          <DeleteAllFilesDialog
            open={this.props.deleteFilesDialog.open}
            handleClose={this.props.actions.toggleDeleteFilesDialog}
            deleteFiles={this.props.actions.deleteFiles}
            files={this.props.checkedFiles}
            />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    checkedFiles: state.files.filter( file => file.checked ),
    filesBuffer: state.filesBuffer,
    roles: state.roles,
    users: state.users,
    createDirState: state.createDir,
    tenant: state.tenant,
    selectedDir: state.dirTree.selected,
    moveFilesState: state.moveFilesState,
    deleteFilesDialog: state.deleteFiles
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(FileActions, dispatch)
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

export default withRouter(FileActionContainer);
