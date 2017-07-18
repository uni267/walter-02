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
import { Card, CardTitle, CardText, CardMedia } from 'material-ui/Card';

// components
import Authority from "../FileDetail/Authority";
import DirTree from "../DirTree";

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
    height: 48,
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Roboto sans-serif",
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

  render() {
    const { isDragging, connectDragSource, file, onDeleteDone } = this.props;

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = this.state.checked ? "rgb(232, 232, 232)" : "inherit";

    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

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

    const editAuthoryActions = (
      <FlatButton
        label="close"
        onTouchTap={() => this.setState({ editAuthority: { open: false } })}
        />
    );

    const editFileActions = [
      (
        <FlatButton
          label="save"
          primary={true}
          onTouchTap={(e) => {
            e.preventDefault();
            const file_name = this.refs.fileName.getValue();
            if ( file_name === "" ) {
              this.setState({ editFile: { open: false } });
              return;
            }

            let file = this.props.file;
            file.name = file_name;
            this.props.editFile(file);
            this.setState({ editFile: { open: false } });
            this.props.triggerSnackbar("ファイル名を変更しました");
          }}
          />
      ),
      (
        <FlatButton
          label="close"
          primary={false}
          onTouchTap={() => this.setState({ editFile: { open: false } })}
          />
      )
    ];

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

        <div style={{...style.cell, width: "40%"}}>
          <Link to={`/file-detail/${file.id}`} style={{...style.file, color}} >
            {file.name}
          </Link>
        </div>

        <div style={{...style.cell, width: "20%"}}>{file.modified}</div>

        <div style={{...style.cell, width: "15%"}}>{file.owner}</div>

        <div style={{...style.cell, width: "20%"}}>
          <IconMenu
            iconButtonElement={action_menu_icon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <MenuItem
              onTouchTap={() => this.setState({ copyFile: { open: true } })}
              primaryText="コピー" />

            <MenuItem
              primaryText="ファイル名変更"
              onTouchTap={() => this.setState({ editFile: { open: true } })} />

            <MenuItem
              primaryText="ファイル削除"
              onTouchTap={() => this.setState({ deleteFile: { open: true } })} />

            <MenuItem
              primaryText="移動"
              onTouchTap={() => this.setState({ moveFile: { open: true } })} />

            <MenuItem
              primaryText="権限を変更"
              onTouchTap={() => this.setState({ editAuthority: { open: true } })} />

            <MenuItem primaryText="タイムスタンプ発行" />

          </IconMenu>
        </div>

        <Dialog
          title="ファイル名を変更"
          modal={false}
          actions={editFileActions}
          open={this.state.editFile.open}
          onRequestClose={() => this.setState({ editFile: { open: false } })} >

          <TextField
            ref="fileName"
            defaultValue={this.props.file.name}
            floatingLabelText="ファイル名を変更" />

        </Dialog>

        <Dialog
          title="権限を変更"
          modal={false}
          actions={editAuthoryActions}
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

        <Dialog
          title={`${this.props.file.name}を削除しますか？`}
          modal={false}
          actions={deleteFileActions}
          open={this.state.deleteFile.open}
          onRequestClose={() => this.setState({ deleteFile: {open: false} })}
        >
        </Dialog>

        <Dialog
          title="ファイルを移動"
          open={this.state.moveFile.open}
          modal={false}
          actions={moveFileActions} >

          <DirTree />

        </Dialog>

        <Dialog
          title="ファイルをコピー"
          open={this.state.copyFile.open}
          modal={false}
          actions={copyFileActions} >

          <DirTree />

        </Dialog>

      </div>
    );
  }
}

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
