import React, { Component } from "react";
import TextField from "material-ui/TextField";

class FileSearch extends Component {
  render() {
    const handleChange = (e) => {
      this.props.searchFile(e.target.value);
    };

    return (
      <div className="file-search">
        <TextField
          value={this.props.searchWord.value}
          onChange={handleChange}
          hintText=""
          floatingLabelText="search"
          />
      </div>
    );
  }
};

export default FileSearch;
