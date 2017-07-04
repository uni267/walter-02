import React, { Component } from "react";
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Snackbar from "material-ui/Snackbar";
import FileListAction from "../FileBox/FileList/FileListAction";
import Dir from "./Dir";
import File from "./File";
import Header from "./Header";
import FILES from "../../mock-files";

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
    const renderRow = (file, idx) => {
      if (file.is_dir) {
        return (
          <Dir key={idx} dir={file}
               onDeleteClick={onDeleteClick}
               onDeleteDone={onDeleteDone} />
        );
      }
      else {
        return (
          <File key={idx} file={file}
            onDeleteClick={onDeleteClick}
            onDeleteDone={onDeleteDone} />
        );
      }
    };

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
        <DragDropContextProvider backend={HTML5Backend}>
          <div>
            <Header sortFile={sortFile} />
            {files.map((file, idx) => renderRow(file, idx))}
          </div>
        </DragDropContextProvider>
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
