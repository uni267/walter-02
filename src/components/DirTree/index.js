import React, { Component } from "react";
import FileFolder from "material-ui/svg-icons/file/folder";
import HardwareKeyboardArrowRight from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import HardwareKeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";

const styles = {
  childList: {
    margin: 0,
    paddingTop: 10,
    paddingLeft: 15
  },
  noToggleIcon: {
    paddingLeft: 24
  },
  folderIcon: {
    paddingRight: 5
  }
};

class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  toggleIcon = () => {
    if (this.props.nodes.children === undefined) {
      return <span style={styles.noToggleIcon}></span>;
    }

    return this.state.open
      ? <HardwareKeyboardArrowDown onClick={this.toggleOpen} />
      : <HardwareKeyboardArrowRight onClick={this.toggleOpen} />;
  };

  render() {
    const { nodes, onClickSelect, selectedId } = this.props;
    const textColor = selectedId === nodes.id ? "rgb(0, 188, 212)" : "inherit";
    const folderColor = selectedId === nodes.id ? "rgb(0, 188, 212)" : "inherit";

    let childNodes;

    if (nodes.children === undefined || !this.state.open) {
      childNodes = null;
    } else {
      childNodes = nodes.children.map( (child, idx) => {
        return (
          <TreeNode
            key={idx}
            nodes={child}
            onClickSelect={onClickSelect}
            selectedId={selectedId}
            />
        );
      });
    }

    return (
      <div>
        {this.toggleIcon()}
        <span
          style={{color: textColor, verticalAlign: "top"}}
          onClick={() => onClickSelect(nodes)}>

          <FileFolder
            style={{...styles.folderIcon, color: folderColor}}
            onClick={this.toggleSelect} />

          {nodes.name}

        </span>
        <ul style={styles.childList}>{childNodes}</ul>
      </div>
    );
  }
}

class DirTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null
    };

    this.onClickSelect = this.onClickSelect.bind(this);
  }

  onClickSelect = (node) => {
    console.log(this.state.selectedId);

    this.setState({
      selectedId: node.id
    });
  };

  render() {
    const nodes = {
      id: 1,
      name: "1",
      children: [
        { id: 11, name: "1-1" },
        { id: 12, name: "1-2",
          children: [
            { id: 121, name: "1-2-1" },
            { id: 122, name: "1-2-2" }
          ]
        },
        { id: 13, name: "1-3",
          children: [
            { id: 131, name: "1-3-1" },
            { id: 132, name: "1-3-2",
              children: [
                { id: 1321, name: "1-3-2-1" }
              ]
            }
          ]
        }
      ]
    };

    return (
      <TreeNode
        nodes={nodes}
        onClickSelect={this.onClickSelect}
        selectedId={this.state.selectedId} />
    );
  }
}

export default DirTree;
