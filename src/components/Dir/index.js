import React, { Component } from "react";
import { DropTarget } from 'react-dnd';
import { Link } from "react-router-dom";

// material
import Checkbox from 'material-ui/Checkbox';
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import IconMenu from "material-ui/IconMenu";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";
import Authority from "../FileDetail/Authority";
import History from "../FileDetail/History";

const style = {
  row: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray"
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
  dir: {
    textDecoration: "none",
    color: "#555"
  },
  dir_icon: {
    padding: 0,
    marginRight: 10
  },
  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  }

};

const fileTarget = {
  drop(props) {
    return { name: props.dir.id };
  }
};

class Dir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      hover: false,
      editDir: { open: false },
      editAuthority: { open: false },
      deleteDir: { open: false },
      moveDir: { open: false },
      copyDir: { open: false },
      historiesDir: { open: false }
    };

    this.onClickCheckBox = this.onClickCheckBox.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  onClickCheckBox() {
    this.setState({ checked: !this.state.checked });
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover });
  };

  changeDirName = () => {
    const dirName = this.refs.dirName.getValue();
    if ( dirName === "" ) {
      this.setState({ editDir: { open: false } });
      return;
    }

    this.props.editDir({...this.props.dir, name: dirName});
    this.setState({ editDir: { open: false } });
    this.props.triggerSnackbar("フォルダ名を変更しました");

  };

  renderMember = () => {
    const { authorities } = this.props.dir;

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

  renderMoveDialog = () => {
    const actions = [
      (
        <FlatButton
          label="移動"
          primary={true}
          />
      ),
      (
        <FlatButton
          label="close"
          onTouchTap={() => this.setState({ moveDir: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title="フォルダを移動"
        open={this.state.moveDir.open}
        modal={false}
        actions={actions} >

        <DirTreeContainer />

      </Dialog>
    );
  };

  renderCopyDialog = () => {
    const actions = [
      (
        <FlatButton
          label="コピー"
          primary={true}
          />
      ),
      (
        <FlatButton
          label="close"
          onTouchTap={() => this.setState({ copyDir: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title="フォルダをコピー"
        open={this.state.copyDir.open}
        modal={false}
        actions={actions} >

        <DirTreeContainer />

      </Dialog>
    );
  };

  renderDeleteDialog = () => {
    const actions = [
      (
        <FlatButton
          label="Delete"
          primary={true}
          onTouchTap={(e) => {
            this.props.deleteDir(this.props.dir);
            this.setState({ deleteDir: { open: false } });
            this.props.triggerSnackbar(`${this.props.dir.name}を削除しました`);
          }}
          />
      ),
      (
        <FlatButton
          label="close"
          primary={false}
          onTouchTap={() => this.setState({ deleteDir: { open: false } })}
          />
      )
    ];

    return (
      <Dialog
        title={`${this.props.dir.name}を削除しますか？`}
        modal={false}
        actions={actions}
        open={this.state.deleteDir.open}
        onRequestClose={() => this.setState({ deleteDir: {open: false} })}
        >
      </Dialog>
    );
  };

  renderAuthorityDialog = () => {
    const actions = (
      <FlatButton
        label="close"
        onTouchTap={() => this.setState({ editAuthority: { open: false } })}
        />
    );
    
    return (
      <Dialog
        title="権限を変更"
        modal={false}
        actions={actions}
        open={this.state.editAuthority.open}
        onRequestClose={() => this.setState({ editAuthority: { open: false } })} >

        <Authority
          file={this.props.dir}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  };

  renderHistoryDialog = () => {
    
    const actions = (
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ historiesDir: { open: false } })}
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
        open={this.state.historiesDir.open}
        modal={false}
        actions={actions} >

        {this.props.dir.histories.map(
        (history, idx) => renderHistory(idx, history))}

      </Dialog>
      
    );
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { dir } = this.props;

    const isActive = canDrop && isOver;
    const backgroundColor = isActive || this.state.checked 
        ? "rgb(232, 232, 232)" : "inherit";

    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const favorite_icon = (
      <ActionFavorite />
    );

    const favorite_icon_border = (
      <ActionFavoriteBorder />
    );

    const action_menu_icon = (
      <IconButton>
        <NavigationMenu />
      </IconButton>
    );

    const dirNameArea = this.state.editDir.open ?
          (
            <TextField
              ref="dirName"
              defaultValue={this.props.dir.name}
              onKeyDown={e => e.key === "Enter" ? this.changeDirName() : null } />
          )
          :
          (
            <Link
              to={`/home/?dir_id=${this.props.dir.id}`}
              style={{...style.dir, color}} >
              {this.props.dir.name}
            </Link>
          );

    const deleteDirActions = [
      (
        <FlatButton
          label="Delete"
          primary={true}
          onTouchTap={() => {
            this.props.deleteDir(this.props.dir);
            this.props.deleteDirTree(this.props.dir);
            this.props.triggerSnackbar(`${this.props.dir.name}を削除しました`);
            this.setState({ deleteDir: { open: false } });
          }}
          />
      ),
      (
        <FlatButton
          label="close"
          primary={false}
          onTouchTap={() => this.setState({ deleteDir: { open: false } })}
          />
      )
    ];

    return connectDropTarget(
      <div
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        style={{...style.row, backgroundColor}}>

        <div style={{...style.cell, width: "5%"}}>
          <Checkbox
            style={style.checkbox}
            onCheck={this.onClickCheckBox} />

          <Checkbox
            disabled={true}
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border} />
        </div>

        <div style={{...style.cell, width: "50%"}}>
          <FileFolderOpen style={style.dir_icon} />
          {dirNameArea}
        </div>

        <div style={{...style.cell, width: "20%"}}>{dir.modified}</div>

        <div style={{...style.cell, width: "15%"}}>
          {this.renderMember()}
        </div>

        <div style={{...style.cell, width: "10%"}}>
          <IconMenu
            iconButtonElement={action_menu_icon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <MenuItem
              primaryText="フォルダ名変更"
              onTouchTap={() => this.setState({ editDir: { open: true } })}
              />

            <MenuItem
              primaryText="移動"
              onTouchTap={() => this.setState({ moveDir: { open: true } })}
              />

            <MenuItem
              primaryText="コピー"
              onTouchTap={() => this.setState({ copyDir: { open: true } })}
              />

            <MenuItem
              primaryText="削除" 
              onTouchTap={() => this.setState({ deleteDir: { open: true } })}
              />

            <MenuItem
              primaryText="権限を変更"
              onTouchTap={() => this.setState({ editAuthority: { open: true } })}
              />

            <MenuItem
              primaryText="履歴を閲覧"
              onTouchTap={() => this.setState({ historiesDir: { open: true } })}
              />

          </IconMenu>
        </div>

        <this.renderMoveDialog />
        <this.renderCopyDialog />
        <this.renderDeleteDialog />
        <this.renderAuthorityDialog />
        <this.renderHistoryDialog />
      </div>
    );
  }
}

export default DropTarget("file", fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Dir);
