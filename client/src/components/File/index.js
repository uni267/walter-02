import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// material
import Checkbox from 'material-ui/Checkbox';
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";

// mateirla-icon
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import FileFileDownload from "material-ui/svg-icons/file/file-download";
import EditorModeEdit from "material-ui/svg-icons/editor/mode-edit";
import ContentContentCopy from "material-ui/svg-icons/content/content-copy";
import ContentForward from "material-ui/svg-icons/content/forward";
import ActionDelete from "material-ui/svg-icons/action/delete";
import ActionVerifiedUser from "material-ui/svg-icons/action/verified-user";
import ActionLabel from "material-ui/svg-icons/action/label";
import ActionDescription from "material-ui/svg-icons/action/description";
import ActionHistory from "material-ui/svg-icons/action/history";
import ActionFingerprint from "material-ui/svg-icons/action/fingerprint";
import ActionRestore from "material-ui/svg-icons/action/restore";

import * as constants from "../../constants";

const style = {
  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  },

  fileDetail: {
    textDecoration: "none",
    color: "#111"
  }
};

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      editFile: {
        open: false
      }
    };
  }

  renderFileName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const changeFileName = () => {

      const fileName = this.refs.fileName.getValue();

      if ( fileName === "" ) {
        this.setState({ editFile: { open: false } });
        return;
      }

      this.props.actions.editFileByIndex({ ...this.props.file, name: fileName });
      this.setState({ editFile: { open: false } });
    };

    const fileInput = (
      <div style={{...this.props.cellStyle, width: this.props.headers[1].width}}>
        
        <TextField
          id={this.props.file._id}
          ref="fileName"
          defaultValue={this.props.file.name}
          onKeyDown={e => e.key === "Enter" ? changeFileName() : null} />

      </div>
    );

    const linkToFileDetail = () => {
      this.props.history.push(`/files/${this.props.file._id}`);
    };

    const linkToDir = () => {
      this.props.history.push(`/home/${this.props.file.dir_id}`);
    };

    const style = {
      ...this.props.cellStyle,
      width: this.props.headers[1].width, color
    };

    let fileView;

    if (this.props.file.dir_route !== undefined) {
      const dir_route = this.props.file.dir_route === ""
            ? constants.TOP_DIR_NAME : this.props.file.dir_route;

      fileView = (
        <div style={style}>
          <div>
            <div onClick={linkToFileDetail}>
              {this.props.file.name}
            </div>
            <div style={{ fontSize: 12, color: "#aaa"}} onClick={linkToDir}>
              場所: {dir_route}
            </div>
          </div>
        </div>
      );
    }
    else {
      fileView = (
        <div
          style={style}
          onClick={linkToFileDetail}>
          {this.props.file.name}
        </div>
      );
    }

    return this.state.editFile.open ? fileInput : fileView;
  };

  renderMember = () => {
    // const { authorities } = this.props.file;

    // const member = authorities.length > 1
    //       ? `${authorities.length} 人のメンバー`
    //       : `${authorities[0].user.name} のみ`;

    return null;
      // <span
      //   onClick={() => this.setState({ editAuthority: { open: true } })}>
      //   {member}
      // </span>
  };

  render() {
    const { isDragging, connectDragSource, file } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = file.checked ? "rgb(232, 232, 232)" : "inherit";

    const checkOpacity = this.state.hover || file.checked ? 1 : 0.1;

    const action_menu_icon = () => {
      const opacity = this.state.hover ? 1 : 0.1;
      return (
        <IconButton style={{ opacity }}>
          <NavigationMenu />
        </IconButton>
      );
    };

    const favorite_icon = (
      <ActionFavorite />
    );

    const favorite_icon_border = (
      <ActionFavoriteBorder />
    );

    const elements = (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{ ...rowStyle, opacity, backgroundColor }}>

        <div style={{ ...cellStyle, width: headers[0].width }}>
          <Checkbox
            checked={file.checked}
            style={{ ...style.checkbox, opacity: checkOpacity }}
            onCheck={() => {
              this.props.setYOffset(window.pageYOffset);
              this.props.actions.toggleFileCheck(file);
            }} />

          <Checkbox
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border}
            checked={file.is_star}
            onCheck={() => this.props.actions.toggleStar(file)} />
        </div>

        {this.renderFileName()}

        <div style={{ ...cellStyle, width: headers[2].width }}>
          {moment(file.modified).format("YYYY-MM-DD hh:mm:ss")}
        </div>

        <div style={{ ...cellStyle, width: headers[3].width }}>
          {this.renderMember()}
        </div>

        <div style={{ ...cellStyle, width: headers[4].width }}>
          <IconMenu
            iconButtonElement={action_menu_icon()}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <MenuItem
              primaryText="ダウンロード"
              leftIcon={<FileFileDownload />}
              onTouchTap={() => this.props.actions.downloadFile(file)}
              />
            <MenuItem
              primaryText="ファイル名変更"
              leftIcon={<EditorModeEdit />}
              onTouchTap={() => this.setState({ editFile: { open: true } })} />

            <MenuItem
              primaryText="移動"
              leftIcon={<ContentForward />}
              onTouchTap={() => this.props.actions.toggleMoveFileDialog(file)} />

            <MenuItem
              onTouchTap={() => this.props.actions.toggleCopyFileDialog(file)}
              leftIcon={<ContentContentCopy />}
              primaryText="コピー" />

            <MenuItem
              primaryText="削除"
              leftIcon={<ActionDelete />}
              onTouchTap={() => this.props.actions.toggleDeleteFileDialog(file)} />

            <MenuItem
              primaryText="権限を変更"
              leftIcon={<ActionVerifiedUser />}
              onTouchTap={() => this.props.actions.toggleAuthorityFileDialog(file)} />

            <MenuItem
              primaryText="タグを編集"
              leftIcon={<ActionLabel />}
              onTouchTap={() => this.props.actions.toggleFileTagDialog(file)} />

            <MenuItem
              primaryText="メタ情報を編集"
              leftIcon={<ActionDescription />}
              onTouchTap={() => this.props.actions.toggleFileMetaInfoDialog(file)} />

            <MenuItem
              primaryText="履歴を閲覧"
              leftIcon={<ActionHistory />}
              onTouchTap={() => this.props.actions.toggleHistoryFileDialog(file)} />

            <MenuItem
              primaryText="タイムスタンプ発行"
              leftIcon={<ActionFingerprint />}
              />

            {this.props.tenant.trashDirId === file.dir_id ?
              (
                <MenuItem
                  primaryText="ゴミ箱から戻す"
                  leftIcon={<ActionRestore />}
                  onTouchTap={() => this.props.actions.toggleRestoreFileDialog(file)}
                  />
              ) : null}

          </IconMenu>
        </div>

      </div>
    );

    return isDragging && connectDragSource
      ? connectDragSource(elements)
      : elements;
  }
}

File.propTypes = {
  history: PropTypes.object.isRequired,
  dir_id: PropTypes.string.isRequired,
  rowStyle: PropTypes.object.isRequired,
  cellStyle: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  file: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  editFileByIndex: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  toggleStar: PropTypes.func.isRequired,
  handleAuthorityFile: PropTypes.func.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
  handleMoveFile: PropTypes.func.isRequired,
  handleCopyFile: PropTypes.func.isRequired,
  handleHistoryFile: PropTypes.func.isRequired,
  handleTagFile: PropTypes.func.isRequired
};

export default File;
