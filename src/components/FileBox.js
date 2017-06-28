import React, { Component } from "react";
import axios from "axios";
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Card } from "material-ui/Card";

import FileAction from "./FileAction";
import FileSearch from "./FileSearch";
import DirBox from "./DirBox";
import FileList from "./FileList";


injectTapEventPlugin();

class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dirs: []
    }
  }

  componentWillMount() {
    this.getFiles();
    this.getDirs();
  }

  getDirs() {
    /* const url = "http://localhost:3333/dirs";
     * axios.get(url)
     *      .then( res => this.setState({dirs: res.data}))
     *      .catch( err => console.log(err) );*/
    this.setState({
      dirs: [
        {id: 1, name: "dir01"},
        {id: 2, name: "dir02"},
      ],
    });
  }

  getFiles() {
    /* const url = "http://localhost:3333/files";
     * axios.get(url)
     *      .then(res => this.setState({files: res.data}))
     *      .catch( err => console.log(err) );*/
    this.setState({
      files: [
        {id: 1, name: "file01.txt"},
        {id: 2, name: "file02.txt"},
      ],
    });
  }

  onFileViewClick(e) {
    console.log(e.target.dataset.file);
  }

  render() {
    return (
      <div className="file-box">
        <Card>
          <FileAction />
          <FileSearch />
          <DirBox dirs={this.state.dirs} />
          <FileList
            files={this.state.files}
            onViewClick={this.onFileViewClick}
          />
        </Card>
      </div>
    )
  }
}

export default FileBox;
