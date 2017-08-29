import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
import { Card } from 'material-ui/Card';

// containers
import NavigationContainer from "./NavigationContainer";
import FileActionContainer from "./FileActionContainer";
import FileSearchContainer from "./FileSearchContainer";
import DirBoxContainer from "./DirBoxContainer";
import FileListContainer from "./FileListContainer";
import FileSnackbar from "../components/FileSnackbar";

// actions
import {
  triggerSnackbar,
  closeSnackbar,
  requestFetchFiles
}
from "../actions";

class HomeContainer extends Component {
  componentWillMount() {
    this.props.requestFetchFiles(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.requestFetchFiles(nextProps.match.params.id);
    }
  }

  render() {
    const dirId = this.props.match.params.id;

    return (
      <div>
        <NavigationContainer />

        <Card>
          <div style={{display: "flex"}}>
            <div style={{width: "40%"}}>
              <DirBoxContainer />
            </div>

            <div style={{width: "60%"}}>
              <FileSearchContainer />
            </div>
          </div>

          <div style={{display: "flex"}}>
            <div style={{width: "78%"}}>

              <FileListContainer dir_id={dirId} />

            </div>

            <div style={{width: "22%"}}>
              <FileActionContainer dir_id={dirId} />
            </div>

            <FileSnackbar
              closeSnackbar={this.props.closeSnackbar}
              snackbar={this.props.snackbar} />

          </div>
        </Card>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    snackbar: state.snackbar,
    searchWord: state.searchFile,
    fileSortTarget: state.fileSortTarget,
    session: state.session,
    loading: state.loading,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  closeSnackbar: () => { dispatch(closeSnackbar()); },
  requestFetchFiles: (dir_id) => { dispatch(requestFetchFiles(dir_id)); }
});

HomeContainer = connect(mapStateToProps, mapDispatchToProps)(HomeContainer);

export default HomeContainer;
