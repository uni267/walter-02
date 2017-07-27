import React, { Component } from "react";
import PropTypes from "prop-types";

// containers
import NavigationContainer from "./NavigationContainer";
import FileBoxContainer from "./FileBoxContainer";

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.getDirId = this.getDirId.bind(this);
  }

  getDirId() {
    const params = new URLSearchParams(this.props.location.search);
    return (params.get("dir_id") === null) ?
      0 : Number(params.get("dir_id"));
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        <FileBoxContainer dir_id={this.getDirId()} />
      </div>
    );
  }
}

HomeContainer.propTypes = {
};

export default HomeContainer;
