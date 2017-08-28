import React, { Component } from "react";
import { fetchDirTree } from "../../apis";

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
    fetchDirTree(this.props.node._id)
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
      return <DirTree key={idx} node={child} />;
    });
  };

  handleClick = () => {
    this.setState({ viewChild: !this.state.viewChild });
  };

  hasChildren = () => {
    return this.state.children.length === 0;
  };

  render() {

    return (
      <div style={styles.childWrapper}>

        <div style={{ display: "flex" }}>

          <div onClick={this.handleClick}>
            {this.state.viewChild
              ? <HardwareKeyboardArrowDown />
              : <HardwareKeyboardArrowRight />
            }
          </div>

          <div style={{ marginLeft: 7 }}>
            {this.state.viewChild
              ? <FileFolderOpen />
              : <FileFolder />
            }
          </div>

          <div style={{ marginLeft: 7 }}>
            {this.props.node.name}
          </div>

        </div>

        { this.state.viewChild ? this.renderChildren() : null }
      </div>
    );
  }
};

export default DirTree;
