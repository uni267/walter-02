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
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

// components
import Authority from "../FileDetail/Authority";
import History from "../FileDetail/History";
import DirTreeContainer from "../../containers/DirTreeContainer";
import Tag from "../Tag";

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
      name: props.file.id
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.moveFile(item.name, dropResult.name);
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
      },
      editAuthority: {
        open: false
      },
      deleteFile: {
        open: false
      },
      moveFile: {
        open: false,
        dirId: null
      },
      copyFile: {
        open: false
      },
      historiesFile: {
        open: false
      },
      editTag: {
        open: false
      }
    };

    this.onClickCheckBox = this.onClickCheckBox.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  onClickStar(file) {
    this.props.toggleStar(file);

    const message = file.is_star
          ? `${file.name}をマーク解除しました`
          : `${file.name}をマークしました`;

    this.props.triggerSnackbar(message);
  }

  onClickCheckBox() {
    this.setState({ checked: !this.state.checked });
  };

  toggleHover() {
    this.setState({ hover: !this.state.hover });
  };

  renderAuthorityDialog = () => {
    const editAuthorityActions = (
      <FlatButton
        label="閉じる"
        primary={true}
        onTouchTap={() => this.setState({ editAuthority: { open: false } })}
        />
    );
    
    return (
      <Dialog
        title="権限を変更"
        modal={false}
        actions={editAuthorityActions}
        open={this.state.editAuthority.open}
        onRequestClose={() => this.setState({ editAuthority: { open: false } })} >

        <Authority
          file={this.props.file}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  };

  renderDeleteDialog = () => {
    const deleteFileActions = [
      (
        <FlatButton
          label="Delete"
          primary={true}
          onTouchTap={(e) => {
            this.props.deleteFile(this.props.file);
            this.setState({ deleteFile: { open: false } });
            this.props.triggerSnackbar(`${this.props.file.name}を削除しました`);
          }}
          />
      ),
      (
        <FlatButton
          label="close"
          primary={false}
          onTouchTap={() => this.setState({ deleteFile: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title={`${this.props.file.name}を削除しますか？`}
        modal={false}
        actions={deleteFileActions}
        open={this.state.deleteFile.open}
        onRequestClose={() => this.setState({ deleteFile: {open: false} })}
        >
      </Dialog>
    );
  };

  renderMoveDialog = () => {
    const handleMove = () => {
      this.props.moveFile(
        this.props.file.id, this.props.selectedDir.id
      );

      this.setState({ moveFile: { open: false } });
      this.props.triggerSnackbar("ファイルを移動しました");
    };

    const moveFileActions = [
      (
        <FlatButton
          label="移動"
          onTouchTap={handleMove}
          primary={true}
          />
      ),
      (
        <FlatButton
          label="close"
          onTouchTap={() => this.setState({ moveFile: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title="ファイルを移動"
        open={this.state.moveFile.open}
        modal={false}
        actions={moveFileActions} >

        <DirTreeContainer />

      </Dialog>
    );
  };

  renderCopyDialog = () => {
    const handleCopy = () => {
      this.props.copyFile(this.props.selectedDir.id, this.props.file);
      this.setState({ copyFile: { open: false } });
      this.props.triggerSnackbar("ファイルをコピーしました");
    };

    const copyFileActions = [
      (
        <FlatButton
          label="コピー"
          onTouchTap={handleCopy}
          primary={true}
          />
      ),
      (
        <FlatButton
          label="close"
          onTouchTap={() => this.setState({ copyFile: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title="ファイルをコピー"
        open={this.state.copyFile.open}
        modal={false}
        actions={copyFileActions} >

        <DirTreeContainer />

      </Dialog>
    );
  };

  renderHistoryDialog = () => {
    
    const actions = (
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ historiesFile: { open: false } })}
        />
    );

    const renderHistory = (idx, history) => {
      return (
        <History key={idx} history={history} />        
      );
    };

    return (
      <Dialog
        title="履歴"
        open={this.state.historiesFile.open}
        modal={false}
        actions={actions} >

        {this.props.file.histories.map(
        (history, idx) => renderHistory(idx, history))}

      </Dialog>
      
    );
  };

  renderTagDialog = () => {
    const actions = (
      <FlatButton
        label="close"
        primary={true}
        onTouchTap={() => this.setState({ editTag: { open: false } })}
        />
    );

    return (
      <Dialog
        title="タグ編集"
        open={this.state.editTag.open}
        modal={false}
        actions={actions} >

        <Tag 
          file={this.props.file}
          addTag={this.props.addTag}
          deleteTag={this.props.deleteTag}
          triggerSnackbar={this.props.triggerSnackbar}
          />

        </Dialog>
    );
  };

  renderFileName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const changeFileName = () => {

      const fileName = this.refs.fileName.getValue();

      if ( fileName === "" ) {
        this.setState({ editFile: { open: false } });
        return;
      }

      this.props.editFile({ ...this.props.file, name: fileName });
      this.setState({ editFile: { open: false } });
      this.props.triggerSnackbar("ファイル名を変更しました");
    };

    const fileInput = (
      <div style={{...this.props.cellStyle, width: this.props.headers[1].width}}>
        
        <TextField
          ref="fileName"
          defaultValue={this.props.file.name}
          onKeyDown={e => e.key === "Enter" ? changeFileName() : null} />

      </div>
    );

    const handleClick = () => {
      this.props.history.push(`/file-detail/${this.props.file.id}`);
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
          : `${authorities[0].user.name_jp} のみ`;

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
              onTouchTap={() => this.setState({ moveFile: { open: true } })} />

            <MenuItem
              onTouchTap={() => this.setState({ copyFile: { open: true } })}
              primaryText="コピー" />

            <MenuItem
              primaryText="削除"
              onTouchTap={() => this.setState({ deleteFile: { open: true } })} />

            <MenuItem
              primaryText="権限を変更"
              onTouchTap={() => this.setState({ editAuthority: { open: true } })} />

            <MenuItem
              primaryText="タグを編集"
              onTouchTap={() => this.setState({ editTag: { open: true } })} />

            <MenuItem
              primaryText="履歴を閲覧"
              onTouchTap={() => this.setState({ historiesFile: { open: true } })} />

            <MenuItem primaryText="タイムスタンプ発行" />

          </IconMenu>
        </div>

        <this.renderAuthorityDialog />
        <this.renderDeleteDialog />
        <this.renderMoveDialog />
        <this.renderCopyDialog />
        <this.renderHistoryDialog />
        <this.renderTagDialog />

      </div>
    );
  }
}

File.propTypes = {
  dir_id: PropTypes.number.isRequired,
  rowStyle: PropTypes.object.isRequired,
  cellStyle: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  file: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  moveFile: PropTypes.func.isRequired,
  copyFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  editFile: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  toggleStar: PropTypes.func.isRequired,
  addAuthority: PropTypes.func.isRequired,
  deleteAuthority: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  selectedDir: PropTypes.object.isRequired
};

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
