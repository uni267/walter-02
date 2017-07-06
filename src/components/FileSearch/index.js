import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";

class FileSearch extends Component {
  render() {
    const { search } = this.props;

    const handleChange = (e) => {
      this.props.dispatch({
        type: "SEARCH",
        value: e.target.value
      });
    };

    return (
      <div className="file-search">
        <TextField
          value={search.value}
          onChange={handleChange}
          hintText=""
          floatingLabelText="search"
          />
      </div>
    );
  }
};

FileSearch = connect()(FileSearch);
export default FileSearch;
