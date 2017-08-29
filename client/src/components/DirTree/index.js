import React, { Component } from "react";
import { API } from "../../apis";

// material icons
import FileFolder from "material-ui/svg-icons/file/folder";
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";
import HardwareKeyboardArrowRight from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import HardwareKeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";

const styles = {
  childWrapper: {
    marginLeft: 33,
    marginTop: 10,
    marginBottom: 10
  }
};

class DirTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewChild: false,
      children: null
    };
  }

  componentWillMount() {
    if (this.state.children === null) {
      this.getChild();
    }
  }

  getChild = () => {
    API.fetchDirTree(this.props.node._id)
      .then( payload => {
        this.setState({
          children: payload.data.children
        });
      })
      .catch( err => {
        console.log(err);
      });
  };

  renderChildren = () => {
    return this.state.children.map( (child, idx) => {
      return (
        <DirTree key={idx} node={child}
                 selectDirTree={this.props.selectDirTree}
                 dirTree={this.props.dirTree} />
      );
    });
  };

  handleClick = () => {
    this.setState({ viewChild: !this.state.viewChild });
  };

  hasChildren = () => {
    return this.state.children.length === 0;
  };

  render() {
    const childWrapper = this.props.dirTree.selected &&
          this.props.dirTree.selected._id === this.props.node._id
          ? { ...styles.childWrapper, backgroundColor: "rgb(240, 240, 240)" }
          : styles.childWrapper;

    return (
      <div style={childWrapper}>

        <div style={{ display: "flex" }}>

          <div onClick={this.handleClick}>
            {this.state.viewChild
              ? <HardwareKeyboardArrowDown />
              : <HardwareKeyboardArrowRight />
            }
          </div>

          <div style={{ display: "flex", marginLeft: 7 }} 
               onClick={() => this.props.selectDirTree(this.props.node)}>

            <div>
              {this.state.viewChild
                ? <FileFolderOpen />
                : <FileFolder />
              }
            </div>

            <div style={{ marginLeft: 10 }}>
              {this.props.node.name}
            </div>
          </div>

        </div>

        { this.state.viewChild ? this.renderChildren() : null }
      </div>
    );
  }
};

export default DirTree;
