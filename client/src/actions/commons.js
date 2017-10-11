import * as actionTypes from "../actionTypes";

export const loadingStart = () => ({
  type: actionTypes.LOADING_START
});

export const loadingEnd = () => ({
  type: actionTypes.LOADING_END
});

export const triggerSnackbar = (message) => ({
  type: actionTypes.TRIGGER_SNACK, message
});

export const closeSnackbar = () => ({
  type: actionTypes.CLOSE_SNACK
});
