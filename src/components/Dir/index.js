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

const style = {
  row: {
    display: "flex",
    width: "100%",
    borderBottom: "1px solid lightgray"
  },
  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 48,
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Roboto sans-serif",
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
      hover: false
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

        <div style={{...style.cell, width: "40%"}}>
          <FileFolderOpen style={style.dir_icon} />
          <Link to={`/home/?dir_id=${dir.id}`} style={{...style.dir, color}}>
            {dir.name}
          </Link>
        </div>

        <div style={{...style.cell, width: "20%"}}>{dir.modified}</div>
        <div style={{...style.cell, width: "15%"}}>{dir.owner}</div>
        <div style={{...style.cell, width: "20%"}}>
          <IconMenu
            iconButtonElement={action_menu_icon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>
            <MenuItem primaryText="詳細を表示" />
            <MenuItem primaryText="ダウンロード" />
            <MenuItem primaryText="コピー" />
            <MenuItem primaryText="移動" />
            <MenuItem primaryText="権限を変更" />
          </IconMenu>
        </div>

      </div>
    );
  }
}

export default DropTarget("file", fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Dir);
