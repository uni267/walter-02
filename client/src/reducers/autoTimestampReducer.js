import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  dir: {},
  enable: false
};

const autoTimestampReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.TOGGLE_AUTO_TIMESTAMP_DIALOG:
    return state.open
      ? { ...state, open: !state.open }
      : { ...state, open: !state.open, dir: action.dir, enable: checkAutoTimestampEnabled(action.dir) };
  case actionTypes.TOGGLE_AUTO_TIMESTAMP:
    return { ...state, enable: action.enable }
  default:
    return state;
  }
};

const checkAutoTimestampEnabled = dir => {
  const autoTimestamp = dir.meta_infos.find(m => m.name === "auto_grant_timestamp")
  return (!!autoTimestamp && !!autoTimestamp.value)
}

export default autoTimestampReducer;
