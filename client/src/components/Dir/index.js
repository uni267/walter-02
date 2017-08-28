import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// DnD
import { DropTarget } from 'react-dnd';

// router
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
import TextField from "material-ui/TextField";

const style = {
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
    return {
      dir: props.dir
    };
  }
};

class Dir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      hover: false,
      editDir: { open: false },
      historiesDir: { open: false }
    };

  }

  onClickCheckBox = () => {
    this.setState({ checked: !this.state.checked });
  }

  toggleHover = () => {
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
          : `${authorities[0].user.name} のみ`;

    return (
      <span
        onClick={() => this.setState({ editAuthority: { open: true } })}>
        {member}
      </span>
    );

  };

  renderDirName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const handleClick = () => {
      this.props.history.push(`/home/${this.props.dir._id}`);
    };

    const editable = (
      <TextField
        ref="dirName"
        defaultValue={this.props.dir.name}
        onKeyDown={e => e.key === "Enter" ? this.changeDirName() : null } />
    );

    const view = (
      <div style={{...this.props.cellStyle, width: this.props.headers[1].width}}
           onClick={handleClick} >
        <FileFolderOpen style={style.dir_icon} />
        {this.props.dir.name}
        <Link
          to={`/home/?dir_id=${this.props.dir._id}`}
          style={{...style.dir, color}} >
        </Link>
      </div>
    );

    return this.state.editDir.open ? editable : view;
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { dir } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const isActive = canDrop && isOver;
    const backgroundColor = isActive || this.state.checked 
        ? "rgb(232, 232, 232)" : "inherit";

    const favorite_icon = (
      <ActionFavorite />
    );

    const favorite_icon_border = (
      <ActionFavoriteBorder />
    );

    const action_menu_icon = () => {
      const opacity = this.state.hover ? 1 : 0.1;
      return (
        <IconButton style={{ opacity }}>
          <NavigationMenu />
        </IconButton>
      );
    };

    const checkOpacity = this.state.hover || this.state.checked ? 1 : 0.1;

    return connectDropTarget(
      <div
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        style={{...rowStyle, backgroundColor}}>

        <div style={{...cellStyle, width: headers[0].width}}>
          <Checkbox
            style={{...style.checkbox, opacity: checkOpacity}}
            onCheck={this.onClickCheckBox} />

          <Checkbox
            disabled={true}
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border} />
        </div>

        {this.renderDirName()}

        <div style={{...cellStyle, width: headers[2].width}}>
          {moment(dir.modified).format("YYYY-MM-DD hh:mm:ss")}
        </div>

        <div style={{...cellStyle, width: headers[3].width}}>
          {this.renderMember()}
        </div>

        <div style={{...cellStyle, width: headers[4].width}}>
          <IconMenu
            iconButtonElement={action_menu_icon()}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <MenuItem
              primaryText="フォルダ名変更"
              onTouchTap={() => this.setState({ editDir: { open: true } })} />

            <MenuItem
              primaryText="移動"
              onTouchTap={() => this.props.handleMoveDir(this.props.dir)} />

            <MenuItem
              primaryText="コピー"
              onTouchTap={this.props.handleCopyDir} />

            <MenuItem
              primaryText="削除" 
              onTouchTap={() => this.props.handleDeleteDir(dir)} />

            <MenuItem
              primaryText="権限を変更"
              onTouchTap={() => this.props.handleAuthorityDir(dir)} />

            <MenuItem
              primaryText="履歴を閲覧"
              onTouchTap={() => this.props.handleHistoryDir(dir)} />

          </IconMenu>
        </div>

      </div>
    );
  }
}

Dir.propTypes = {
  history: PropTypes.object.isRequired,
  dir: PropTypes.object.isRequired,
  rowStyle: PropTypes.object.isRequired,
  cellStyle: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  editDir: PropTypes.func.isRequired,
  handleMoveDir: PropTypes.func.isRequired,
  handleCopyDir: PropTypes.func.isRequired,  
  handleDeleteDir: PropTypes.func.isRequired,
  handleAuthorityDir: PropTypes.func.isRequired,
  handleHistoryDir: PropTypes.func.isRequired
};

export default DropTarget("file", fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Dir);
