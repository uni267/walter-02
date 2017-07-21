import React, { Component } from "react";
import { Link } from "react-router-dom";

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

const style = {
  row: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray",
    backgroundColor: "inherit"
  },

  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 70,
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Roboto sans-serif",
    color: "rgb(80, 80, 80)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit"
  },

  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  },

  file: {
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
        open: false
      },
      copyFile: {
        open: false
      },
      historiesFile: {
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
    const moveFileActions = [
      (
        <FlatButton
          label="移動"
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
    const copyFileActions = [
      (
        <FlatButton
          label="コピー"
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

  renderFileName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const changeFileName = () => {
      console.log(this.refs);
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
      <TextField
        ref="fileName"
        defaultValue={this.props.file.name}
        onKeyDown={e => e.key === "Enter" ? changeFileName() : null} />

    );

    const fileView = (
      <Link
        to={`/file-detail/${this.props.file.id}`}
        style={{...style.file, color}} >
        {this.props.file.name}
      </Link>
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

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = this.state.checked ? "rgb(232, 232, 232)" : "inherit";

    const action_menu_icon = (
      <IconButton>
        <NavigationMenu />
      </IconButton>
    );

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
        style={{...style.row, opacity, backgroundColor}}>

        <div style={{...style.cell, width: "5%"}}>
          <Checkbox
            style={style.checkbox}
            onCheck={this.onClickCheckBox} />

          <Checkbox
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border}
            checked={file.is_star}
            onCheck={() => this.onClickStar(file)} />
        </div>

        <div style={{...style.cell, width: "50%"}}>
          {this.renderFileName()}
        </div>

        <div style={{...style.cell, width: "20%"}}>{file.modified}</div>

        <div style={{...style.cell, width: "15%"}}>
          {this.renderMember()}
        </div>

        <div style={{...style.cell, width: "10%"}}>
          <IconMenu
            iconButtonElement={action_menu_icon}
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

      </div>
    );
  }
}

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
