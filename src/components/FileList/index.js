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

    const onMoveDone = () => {
      this.setState({
        snack: {
          open: true,
          message: `ファイルを移動しました`
        }
      });
    };

    const addFilesDone = (file) => {
      this.setState({
        snack: {
          open: true,
          message: `ファイル名: ${file.name} をアップロードしました`
        }
      });
    };

    const { dir_id, files } = this.props;

    return (
      <div className="file-list">
        <TableHeader />
        <TableBody
          dir_id={dir_id}
          files={files}
          onDeleteDone={onDeleteDone}
          onMoveDone={onMoveDone}
          addFilesDone={addFilesDone}
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
