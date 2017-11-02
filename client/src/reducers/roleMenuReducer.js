import * as actionTypes from "../actionTypes";

const initialState = {
  data:{
    roleMenus:[]
  },
  changed:{
    roleMenus:[]
  },
  errors:{}
};

const roleMenuReducer = (state = initialState,action) => {
  switch(action.type) {
    case actionTypes.INIT_ROLE_MENU:
    return {
      ...state,
      data: action.roleMenu,
      changed: action.roleMenu
    };
    case actionTypes.CHANGE_ROLE_MENU_NAME:
      return {
        ...state,
        changed: {
          ...state.changed,
          name: action.name
        }
      };
    case actionTypes.CHANGE_ROLE_MENU_DESCRIPTION:
      return {
        ...state,
        changed: {
          ...state.changed,
          description: action.description
        }
      };
    case actionTypes.SAVE_ROLE_MENU_VALIDATION_ERROR:
      return {
        ...state,
        changed: {
          ...state,
          errors: action.errors
        }
      };
    case actionTypes.CLEAR_ROLE_MENU_VALIDATION_ERROR:
      return {
        ...state,
        errors: {}
      };
    default:
      return state;
  }
};

export default roleMenuReducer;