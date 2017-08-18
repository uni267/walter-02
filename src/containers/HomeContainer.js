import React, { Component } from "react";

// store
import { connect } from "react-redux";

// containers
import NavigationContainer from "./NavigationContainer";
import FileBoxContainer from "./FileBoxContainer";

class HomeContainer extends Component {
  render() {
    const params = new URLSearchParams(this.props.location.search);
    const dirId = params.get("dir_id") === null
          ? this.props.tenant.dirId
          : params.get("dir_id");
          
    return (
      <div>
        <NavigationContainer />

        <FileBoxContainer
          dir_id={dirId}
          history={this.props.history} />

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tenant: state.tenant
  };
};
  
HomeContainer = connect(mapStateToProps)(HomeContainer);

export default HomeContainer;
