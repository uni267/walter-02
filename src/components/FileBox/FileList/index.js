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
      open: false,
      message: "initialize",
      duration: 3000,
    }

  }

  render() {
    const { files, onDeleteClick } = this.props;

    const onDeleteDone = (file) => {
      this.setState({
        open: true,
        message: `${file.name}を削除しました`,
      });
    }

    return (
      <div className="file-list">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>id</TableHeaderColumn>
              <TableHeaderColumn>name</TableHeaderColumn>
              <TableHeaderColumn>action</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map(file => {
              return (
                <TableRow key={file.id}>
                  <TableRowColumn>{file.id}</TableRowColumn>
                  <TableRowColumn>{file.name}</TableRowColumn>
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
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={this.state.duration}
          onRequestClose={() => this.setState({open: false})}
        />

      </div>
    );
  }
}

export default FileList;
