import React, { Component } from "react";
import { connect } from "react-redux";

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

class FileListHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: {
        sorted: null,
        desc: false
      }
    };
  }

  render() {
    const { dispatch } = this.props;
    const headers = [
      {key: "name", width: "50%", label: "名前"},
      {key: "modified", width: "15%", label: "最終更新"},
      {key: "owner", width: "15%", label: "所有者"},
      {key: false, width: "20%", label: "Action"},
    ];

    const onSortClick = (e) => {
      const target = e.target.dataset.sortKey;
      const { sorted, desc } = this.state.sort;
      if (target === undefined) return;

      if (sorted !== target) {
        this.setState({sort: {sorted: target, desc: true}});
      }

      if (sorted === target && desc) {
        this.setState({sort: {sorted: target, desc: false}});
      } else {
        this.setState({sort: {sorted: target, desc: true}});
      }

      dispatch({
        type: "SORT_FILE",
        sort: this.state.sort
      });
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

FileListHeader = connect()(FileListHeader);
export default FileListHeader;
