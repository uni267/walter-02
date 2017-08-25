import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import DirTree from "../components/DirTree";

// actions
import { requestFetchDirTree, selectDirTree } from "../actions";

class DirTreeContainer extends Component {
  componentWillMount() {
    this.props.requestFetchDirTree(this.props.tenant.dirId);    
  }

  renderDirTree = (node, idx) => {
    return (
      <DirTree key={idx} node={node} />
    );
  };

  render() {
   
    if (this.props.dirTree.loading) {
      return <div></div>;
    } else {
      const node = this.props.dirTree.node;

      return (
        <div>
          {node.name}
          {node.children.map( (node, idx) => this.renderDirTree(node, idx) )}
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tenant: state.tenant,
    dirTree: state.dirTree,
    selectedDir: state.selectedDir
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectDirTree: (dir) => { dispatch(selectDirTree(dir)); },
  requestFetchDirTree: (root_id) => { dispatch(requestFetchDirTree(root_id)); }
});

DirTreeContainer = connect(mapStateToProps, mapDispatchToProps)(DirTreeContainer);

export default DirTreeContainer;
