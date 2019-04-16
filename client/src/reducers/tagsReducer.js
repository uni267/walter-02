import * as actionTypes from "../actionTypes";

const initialState = [];

const tagsReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_TAGS:
    return action.tags;
  case actionTypes.SET_TAGS_ORDER_NUMBER:
    return [
      ...state.slice(0, action.index),
      {
        ...state[action.index],
        order: action.order
      },
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
};

export default tagsReducer;
