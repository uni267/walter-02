import React, { Component } from "react";

class FileListHeader extends Component {
  onSortClick = (e) => {
    const target = e.target.dataset.sortKey;
    if (target === undefined) return;

    if (this.props.fileSortTarget.sorted !== target) {
      this.props.setSortTarget(target);
    } else {
      this.props.toggleSortTarget();
    }

    this.props.sortFile(
      this.props.fileSortTarget.sorted, 
      this.props.fileSortTarget.desc
    );
  }

  render() {
    const { idx, header, style } = this.props;

    return (
      <div key={idx}
           onClick={this.onSortClick}
           data-sort-key={header.key}
           style={{...style, width: header.width}}>
        {header.label}
      </div>
    );
  }
}

export default FileListHeader;
