import * as actionTypes from "../actionTypes";

const initialState = {
  data: {
    menus:[]
  }
};


const navigationReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_AUTHORITY_MENU:
    // console.log(action.menus);
    return {
      ...state,
      data: { menus:action.menus }
    };

  default:
    return state;
  }
};

export default navigationReducer;