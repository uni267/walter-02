import React, { Component } from "react";
import { DropTarget } from 'react-dnd';
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info';

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

const fileTarget = {
  drop(props) {
    return { name: props.dir.id };
  }
};

class Dir extends Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { dir } = this.props;

    const isActive = canDrop && isOver;
    let backgroundColor = isActive ? "#ddd" : "#fff";

    return connectDropTarget(
      <div style={{...style.row, backgroundColor}}>
        <div style={{...style.cell, width: "50%"}}>{dir.name}</div>
        <div style={{...style.cell, width: "15%"}}>{dir.modified}</div>
        <div style={{...style.cell, width: "15%"}}>{dir.owner}</div>
        <div style={{...style.cell, width: "20%"}}>view | edit | delete</div>
      </div>
    );
  }
}

export default DropTarget("file", fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Dir);
