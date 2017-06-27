import React, { Component } from "react";
import axios from "axios";
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Card } from "material-ui/Card";

import FileList from "./FileList";
import DirBox from "./DirBox";

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
    const url = "http://localhost:3333/dirs";
    axios.get(url)
    .then( res => this.setState({dirs: res.data}))
    .catch( err => console.log(err) );
  }

  getFiles() {
    const url = "http://localhost:3333/files";
    axios.get(url)
         .then(res => this.setState({files: res.data}))
         .catch( err => console.log(err) );
  }

  onFileViewClick(e) {
    console.log(e.target.dataset.file);
  }

  render() {
    return (
      <div className="file-box">
        <Card>
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
