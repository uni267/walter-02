import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import DirTree from "../components/DirTree";

class DirTreeContainer extends Component {
  walk = (tree) => {
    
    let children = this.props.dirs.filter(
      dir => dir.ancestor === tree.id && dir.depth === 1);

    if (children.length === 0) return tree;

    children = children.map(child => {
      const name = this.props.allFiles.filter(
        file => child.descendant === file.id)[0].name;

      return {
        id: child.descendant,
        name: name,
        children: []
      };
    });

    tree.children = children.map(child => this.walk(child));
    return tree;
  };

  render() {
    const nodes = this.walk({id: 0, name: "Top", children: []});

    return (
      <DirTree nodes={nodes} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dirs: state.dirs,
    allFiles: state.files
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  
});

DirTreeContainer = connect(mapStateToProps, mapDispatchToProps)(DirTreeContainer);
export default DirTreeContainer;
