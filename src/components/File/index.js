import React, { Component } from "react";

// DnD
import { DragSource } from "react-dnd";

// material
import Checkbox from 'material-ui/Checkbox';
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import MenuItem from "material-ui/MenuItem";

// components
import EditIcon from "./EditIcon";
import DeleteIcon from "./DeleteIcon";

const style = {
  row: {
    display: "flex",
    width: "100%",
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
      checked: false
    };
  }

  render() {
    const { isDragging, connectDragSource, file, onDeleteDone } = this.props;

    const onClickCheckBox = () => {
      this.setState({ checked: !this.state.checked });
    };

    const opacity = isDragging ? 0.3 : 1;
    const backgroundColor = this.state.checked ? "rgb(224, 224, 224)" : "inherit";

    const action_menu_icon = (
      <IconButton>
        <NavigationMenu />
      </IconButton>
    );

    return connectDragSource(
      <div style={{...style.row, opacity, backgroundColor}}>
        <div style={{...style.cell, width: "1%"}}>
          <Checkbox onCheck={onClickCheckBox} />
        </div>
        <div style={{...style.cell, width: "49%"}}>{file.name}</div>
        <div style={{...style.cell, width: "15%"}}>{file.modified}</div>
        <div style={{...style.cell, width: "15%"}}>{file.owner}</div>
        <div style={{...style.cell, width: "20%"}}>
          <EditIcon file={file} />
          <DeleteIcon file={file}
                      onDeleteDone={onDeleteDone}
                      triggerSnackbar={this.props.triggerSnackbar}
                      deleteFile={this.props.deleteFile} />
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

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
