import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";
import FileListAction from "../FileBox/FileList/FileListAction";
import Header from "./Header";
import TableBody from "./TableBody";

class DnD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snack: {
        open: false,
        message: "initialized...",
        duration: 3000
      },
      sort: {
        sorted: null,
        desc: false
      }
    };
  }

  render() {
    const onDeleteDone = (file) => {
      this.setState({
        snack: {
          open: true,
          message: `${file.name}を削除しました`
        }
      });
    };

    const { files, onDeleteClick, sortFile } = this.props;

    return (
      <div className="file-list">
        <Header sortFile={sortFile} />
        <TableBody
          files={files}
          onDeleteClick={onDeleteClick}
          onDeleteDone={onDeleteDone}
        />
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

export default DnD;
