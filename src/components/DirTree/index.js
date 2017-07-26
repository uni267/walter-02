import React, { Component } from "react";

// material icons
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";
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

  // ディレクトリ ツリーを展開する
  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  // ディレクトリ ツリー展開用の部品
  toggleIcon = () => {
    if (this.props.nodes.children.length === 0) {
      return <span style={styles.noToggleIcon}></span>;
    }

    return this.state.open
      ? <HardwareKeyboardArrowDown onClick={this.toggleOpen} />
      : <HardwareKeyboardArrowRight onClick={this.toggleOpen} />;
  };

  render() {
    const { nodes, onClickSelect, selectedDir } = this.props;
    const textColor = selectedDir.id === nodes.id ? "rgb(0, 188, 212)" : "inherit";
    const folderColor = selectedDir.id === nodes.id ? "rgb(0, 188, 212)" : "inherit";

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
            selectedDir={selectedDir}
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

          <FileFolderOpen
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
  render() {
    return (
      <TreeNode
        nodes={this.props.nodes}
        onClickSelect={this.props.selectDirTree}
        selectedDir={this.props.selectedDir} />
    );
  }
}

export default DirTree;
