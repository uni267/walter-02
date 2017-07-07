import React, { Component } from "react";
import { DropTarget } from 'react-dnd';
import { Link } from "react-router-dom";

// material
import Checkbox from 'material-ui/Checkbox';
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";

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
      checked: false
    };
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { dir } = this.props;

    const onClickCheckBox = () => {
      this.setState({ checked: !this.state.checked });
    };

    const isActive = canDrop && isOver;
    let backgroundColor = isActive || this.state.checked ? "#ddd" : "#fff";

    return connectDropTarget(
      <div style={{...style.row, backgroundColor}}>
        <div style={{...style.cell, width: "1%"}}>
          <Checkbox onCheck={onClickCheckBox} />
        </div>
        <div style={{...style.cell, width: "49%"}}>
          <FileFolderOpen style={style.dir_icon} />
          <Link to={`/?dir_id=${dir.id}`} style={style.dir}>
            {dir.name}
          </Link>
        </div>
        <div style={{...style.cell, width: "15%"}}>{dir.modified}</div>
        <div style={{...style.cell, width: "15%"}}>{dir.owner}</div>
        <div style={{...style.cell, width: "20%"}}>-</div>
      </div>
    );
  }
}

export default DropTarget("file", fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Dir);
