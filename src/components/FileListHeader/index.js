import React, { Component } from "react";
import PropTypes from "prop-types";

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

FileListHeader.propTypes = {
  header: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  setSortTarget: PropTypes.func.isRequired,
  toggleSortTarget: PropTypes.func.isRequired,
  fileSortTarget: PropTypes.object.isRequired,
  sortFile: PropTypes.func.isRequired
};

export default FileListHeader;
