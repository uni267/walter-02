import React from "react";
import PropTypes from "prop-types";

import Snackbar from "material-ui/Snackbar";
import {red900, grey50} from 'material-ui/styles/colors';

const ErrorReport = ({
  open,
  message
}) => {
  const transform = message
        ? "translate3d(0, 0, 0)" : "translate3d(0, -50px, 0)";

  const style = {
    top: 0,
    bottom: "auto",
    left: (window.innerWidth - 288) * 0.5,
    transform: transform,
    backgroundColor: red900,
    color: grey50
  };

  return (
    <Snackbar
      open={open}
      message={message}
      style={style}
      bodyStyle={style}
      />
  );
};

ErrorReport.propTypes = {
  message: PropTypes.string
};

export default ErrorReport;
