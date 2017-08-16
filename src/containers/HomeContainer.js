import React, { Component } from "react";

// store
import { connect } from "react-redux";

// containers
import NavigationContainer from "./NavigationContainer";
import FileBoxContainer from "./FileBoxContainer";

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirId: null
    };
  }

  componentWillMount() {
    this.setDirId();
  }

  componentWillUpdate(nextProps) {
    this.setDirId();
  }

  setDirId = () => {
    const params = new URLSearchParams(this.props.location.search);
    const dirId = params.get("dir_id") === null
          ? this.props.tenant.dirId
          : Number(params.get("dir_id"));

    this.setState({ dirId: dirId });
  };

  render() {
    return (
      <div>
        <NavigationContainer />
        <FileBoxContainer
          dir_id={this.state.dirId}
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
