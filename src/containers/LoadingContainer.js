import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
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

class LoadingContainer extends Component {
  render() {
    const circular = this.props.loading.start
          ? <CircularProgress size={90} thickness={6} style={styles.circular} />
          : null;

    return (
      <div>
        {circular}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.loading
  };
};

LoadingContainer = connect(mapStateToProps)(LoadingContainer);

export default LoadingContainer;
