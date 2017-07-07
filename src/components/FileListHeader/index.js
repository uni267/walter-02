import React, { Component } from "react";

const style = {
  row: {
    display: "flex",
    width: "100%",
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
  {key: "checkbox", width: "1%", label: ""},
  {key: "name", width: "49%", label: "名前"},
  {key: "modified", width: "15%", label: "最終更新"},
  {key: "owner", width: "15%", label: "所有者"},
  {key: false, width: "20%", label: "Action"},
];

class FileListHeader extends Component {
  render() {
    const onSortClick = (e) => {
      const target = e.target.dataset.sortKey;
      let { sorted, desc } = this.props.fileSortTarget;
      if (target === undefined) return;

      if (sorted !== target) {
        this.props.setSortTarget(target);
      } else {
        this.props.toggleSortTarget();
      }

      this.props.sortFile(
        this.props.fileSortTarget.sorted, 
        this.props.fileSortTarget.desc
      );
    };

    return (
      <div style={style.row}>
        {headers.map( (header, idx) => {
          return (
            <div key={idx}
                 onClick={onSortClick}
                 data-sort-key={header.key}
                 style={{...style.cell, width: header.width}}>
              {header.label}
            </div>
          );
        })}
      </div>
    );
  }
}

export default FileListHeader;
