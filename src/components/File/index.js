import React, { Component } from "react";

// DnD
import { DragSource } from "react-dnd";

// material
import ViewIcon from "./ViewIcon";
import EditIcon from "./EditIcon";
import DeleteIcon from "./DeleteIcon";

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
  render() {
    const { isDragging, connectDragSource, file, onDeleteDone } = this.props;
    const opacity = isDragging ? 0.3 : 1;

    return connectDragSource(
      <div style={{...style.row, opacity}}>
        <div style={{...style.cell, width: "50%"}}>{file.name}</div>
        <div style={{...style.cell, width: "15%"}}>{file.modified}</div>
        <div style={{...style.cell, width: "15%"}}>{file.owner}</div>
        <div style={{...style.cell, width: "20%"}}>
          <ViewIcon file={file} />
          <EditIcon file={file} />
          <DeleteIcon file={file} onDeleteDone={onDeleteDone} />
        </div>
      </div>
    );
  }
}

export default DragSource("file", fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(File);
