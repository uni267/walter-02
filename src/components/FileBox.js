import React, { Component } from "react";
import axios from "axios";
import injectTapEventPlugin from 'react-tap-event-plugin';

import FileList from "./FileList";

injectTapEventPlugin();

class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }

  componentWillMount() {
    this.getFiles();
  }

  getFiles() {
    const url = "http://localhost:3333";
    axios.get(url)
         .then(res => {
           this.setState({files: res.data})
         })
         .catch( err => console.log(err) );
  }

  render() {
    return (
      <div className="file-box">
        <FileList files={this.state.files} />
      </div>
    )
  }
}

export default FileBox;
