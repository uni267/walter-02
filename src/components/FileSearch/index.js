import React, { Component } from "react";
import TextField from "material-ui/TextField";

class FileSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    };
  }

  render() {
    const handleChange = (e) => {
      this.setState({ searchText: e.target.value });
      console.log(this.state.searchText);
    };

    return (
      <div className="file-search">
        <TextField
          value={this.state.searchText}
          onChange={handleChange}
          hintText=""
          floatingLabelText="search"
          />
      </div>
    );
  }
};

export default FileSearch;
