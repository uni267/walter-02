import React, { Component } from "react";
import { fetchDirTree } from "../../apis";

// material icons
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";
import HardwareKeyboardArrowRight from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import HardwareKeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";

const styles = {
  child: {
    marginLeft: 20
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

  render() {

    return (
      <div>
        <div
          style={styles.child}
          onClick={this.handleClick} >

          {this.props.node.name}
        </div>

        <div style={styles.child}>
          { this.state.viewChild ? this.renderChildren() : null }
        </div>
      </div>
    );
  }
};

export default DirTree;
