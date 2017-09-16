import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
import Snackbar from "material-ui/Snackbar";
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  circular: {
    position: "absolute",
    paddingTop: "30%",
    width: "100%",
    height: "100%",
    zIndex: 2000,
    backgroundColor: "#ddd",
    opacity: 0.5,
    textAlign: "center"
  }
};

class NotifyStatusContainer extends Component {
  render() {
    const circular = this.props.loading.start
          ? <CircularProgress size={90} thickness={6} style={styles.circular} />
          : null;

    return (
      <div>
        {circular}
        <Snackbar { ...this.props } />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.loading,
    open: state.snackbar.open,
    message: state.snackbar.message,
    duration: state.snackbar.duration
  };
};

NotifyStatusContainer = connect(mapStateToProps)(NotifyStatusContainer);

export default NotifyStatusContainer;
