import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

class FileList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snack: {
        open: false,
        message: "initialized...",
        duration: 3000
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
        <TableHeader sortFile={sortFile} />
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

export default FileList;
