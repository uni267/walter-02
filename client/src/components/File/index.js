import React, { Component } from "react";
import PropTypes from "prop-types";

// DnD
import { DragSource } from "react-dnd";

// material
import Checkbox from 'material-ui/Checkbox';
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import MenuItem from "material-ui/MenuItem";
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import TextField from "material-ui/TextField";

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

const fileSource = {
  beginDrag(props) {
    return {
      file: props.file
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.moveFile(dropResult.dir, item.file);
    }
  }
};

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      hover: false,
      editFile: {
        open: false
      }
    };

  }

  onClickStar = (file) => {
    this.props.toggleStar(file);

    const message = file.is_star
          ? `${file.name}をマーク解除しました`
          : `${file.name}をマークしました`;

    this.props.triggerSnackbar(message);
  }

  onClickCheckBox() {
    this.setState({ checked: !this.state.checked });
  };

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  renderFileName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const changeFileName = () => {

      const fileName = this.refs.fileName.getValue();

      if ( fileName === "" ) {
        this.setState({ editFile: { open: false } });
        return;
      }

      this.props.editFileByIndex({ ...this.props.file, name: fileName });
      this.setState({ editFile: { open: false } });
      this.props.triggerSnackbar("ファイル名を変更しました");
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

    const handleClick = () => {
      this.props.history.push(`/file-detail/${this.props.file._id}`);
    };

    const fileView = (
      <div
        onClick={handleClick}
        style={{...this.props.cellStyle, width: this.props.headers[1].width, color}}>
        
        {this.props.file.name}

      </div>
    );

    return this.state.editFile.open ? fileInput : fileView;
  };

  renderMember = () => {
    const { authorities } = this.props.file;

    const member = authorities.length > 1
          ? `${authorities.length} 人のメンバー`
          : `${authorities[0].user.name} のみ`;

    return (
      <span
        onClick={() => this.setState({ editAuthority: { open: true } })}>
        {member}
      </span>
    );
  };

  render() {
    const { isDragging, connectDragSource, file } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = this.state.checked ? "rgb(232, 232, 232)" : "inherit";

    const checkOpacity = this.state.hover || this.state.checked ? 1 : 0.1;

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

    return connectDragSource(
      <div
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        style={{...rowStyle, opacity, backgroundColor}}>

        <div style={{...cellStyle, width: headers[0].width}}>
          <Checkbox
            style={{...style.checkbox, opacity: checkOpacity}}
            onCheck={this.onClickCheckBox} />

          <Checkbox
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border}
            checked={file.is_star}
            onCheck={() => this.onClickStar(file)} />
        </div>

        {this.renderFileName()}

        <div style={{...cellStyle, width: headers[2].width}}>
          {file.modified}
        </div>

        <div style={{...cellStyle, width: headers[3].width}}>
          {this.renderMember()}
        </div>

        <div style={{...cellStyle, width: headers[4].width}}>
          <IconMenu
            iconButtonElement={action_menu_icon()}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <MenuItem
              primaryText="ファイル名変更"
              onTouchTap={() => this.setState({ editFile: { open: true } })} />

            <MenuItem
              primaryText="移動"
              onTouchTap={() => this.props.handleMoveFile(file)} />

            <MenuItem
              onTouchTap={() => this.props.handleCopyFile(file)}
              primaryText="コピー" />

            <MenuItem
              primaryText="削除"
              onTouchTap={() => this.props.handleDeleteFile(file)} />

            <MenuItem
              primaryText="権限を変更"
              onTouchTap={() => this.props.handleAuthorityFile(file)} />

            <MenuItem
              primaryText="タグを編集"
              onTouchTap={() => this.props.handleTagFile(file)} />

            <MenuItem
              primaryText="履歴を閲覧"
              onTouchTap={() => this.props.handleHistoryFile(file)} />

            <MenuItem primaryText="タイムスタンプ発行" />

          </IconMenu>
        </div>

      </div>
    );
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

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
