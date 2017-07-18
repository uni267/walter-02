import React, { Component } from "react";

const style = {
  row: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray"
  },
  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 48,
    textAlign: "left",
    fontSize: 12,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    color: "rgb(158, 158, 158)"
  }
};

const headers = [
  {key: "checkbox", width: "5%", label: ""},
  {key: "name", width: "40%", label: "名前"},
  {key: "modified", width: "20%", label: "最終更新"},
  {key: "owner", width: "15%", label: "所有者"},
  {key: false, width: "20%", label: "Action"},
];

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

  renderHeader(header, idx) {
    return (
      <div key={idx}
           onClick={this.onSortClick}
           data-sort-key={header.key}
           style={{...style.cell, width: header.width}}>
        {header.label}
      </div>
    );
  }

  render() {
    return (
      <div style={style.row}>
        {headers.map( (header, idx) => this.renderHeader(header, idx) )}
      </div>
    );
  }
}

export default FileListHeader;
