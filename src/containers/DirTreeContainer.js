import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import DirTree from "../components/DirTree";

// actions
import { selectDirTree } from "../actions";

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
      <DirTree
        selectedDir={this.props.selectedDir}
        selectDirTree={this.props.selectDirTree}
        nodes={nodes} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dirs: state.dirs,
    allFiles: state.files,
    selectedDir: state.selectedDir
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectDirTree: (dir) => { dispatch(selectDirTree(dir)); }
});

DirTreeContainer = connect(mapStateToProps, mapDispatchToProps)(DirTreeContainer);

export default DirTreeContainer;
