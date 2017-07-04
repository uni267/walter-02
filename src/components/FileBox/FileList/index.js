import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";

import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import FileListAction from "./FileListAction";

class FileList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      snack: {
        open: false,
        message: "initialize",
        duration: 3000
      },
      sort: {
        sorted: null,
        desc: false
      }
    };

    this.headers = [
      {name: "名前", sort_key: "name"},
      {name: "最終更新", sort_key: "modified"},
      {name: "所有者", sort_key: "owner"},
      {name: "Action", sort_key: null},
    ];
  }

  render() {
    const { files, onDeleteClick, sortFile } = this.props;

    const onDeleteDone = (file) => {
      this.setState({
        snack: {
          open: true,
          message: `${file.name}を削除しました`
        }
      });
    };

    const renderHeaderColumn = (header, idx) => {
      return (
        <TableHeaderColumn
          key={idx}
          data-sort-key={header.sort_key}
        >
        {header.name}
        </TableHeaderColumn>
      );
    };

    const onSortClick = (e) => {
      const target = e.target.dataset.sortKey;
      const { sorted, desc } = this.state.sort;

      // action列などのソート対象は除外
      if (target === undefined) return;

      if (sorted !== target) {
        this.setState({sort: {sorted: target, desc: true}});
        sortFile(this.state.sort);
        return;
      }

      if (sorted === target && desc ) {
        this.setState({sort: {sorted: target, desc: false}});
      }
      else {
        this.setState({sort: {sorted: target, desc: true}});
      }

      sortFile(this.state.sort);
    };

    return (
      <div className="file-list">
        <Table>
          <TableHeader>
            <TableRow onCellClick={onSortClick}>
            {this.headers.map((header, idx) => renderHeaderColumn(header, idx))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map(file => {
              return (
                <TableRow key={file.id}>
                  <TableRowColumn className="name">{file.name}</TableRowColumn>
                  <TableRowColumn>{file.modified}</TableRowColumn>
                  <TableRowColumn>{file.owner}</TableRowColumn>
                  <TableRowColumn>
                    <FileListAction
                      file={file}
                      onDeleteClick={onDeleteClick}
                      onDeleteDone={onDeleteDone}
                    />
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Snackbar
          open={this.state.snack.open}
          message={this.state.snack.message}
          autoHideDuration={this.state.snack.duration}
          onRequestClose={() => this.setState({snack: {open: false}})}
        />

      </div>
    );
  }
}

export default FileList;
