import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  anchorElement: {},
  items: [],
  searchValues: []
};

const fileDetailSearchReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.TOGGLE_FILE_DETAIL_SEARCH_POPOVER:
    return {
      ...state,
      open: !state.open
    };
  case actionTypes.FILE_DETAIL_SEARCH_ANCHOR_ELEMENT:
    return {
      ...state,
      anchorElement: action.event.currentTarget
    };
  case actionTypes.INIT_FILE_DETAIL_SEARCH_ITEMS:
    return {
      ...state,
      items: action.items
    };
  case actionTypes.SEARCH_ITEM_PICK:
    return {
      ...state,
      items: state.items.map( item => {
        return item._id === action.item._id ?
          { ...item, picked: true } : item;
      })
    };
  case actionTypes.SEARCH_ITEM_NOT_PICK:
    return {
      ...state,
      items: state.items.map( item => (
        item._id === action.item._id ? { ...item, picked: false } : item
      )),
      searchValues: state.searchValues.filter(val => val._id !== action.item._id),
      searchedItems: state.searchValues.filter(val => val._id !== action.item._id)
    };
  case actionTypes.SEARCH_VALUE_CHANGE:
    let searchValues;

    if (state.searchValues.find( obj => obj._id === action.item._id )) {
      searchValues = state.searchValues.map( obj => {
        return obj._id === action.item._id ?
          { ...obj, value: action.value } : obj;
      });
    } else {
      searchValues = [...state.searchValues, {...action.item, value: action.value }];
    }

    return {
      ...state,
      searchValues: searchValues
    };
  case actionTypes.SEARCH_FILE_DETAIL:
    return { ...state, searchedItems :action.items };
  default:
    return state;
  }
};

export default fileDetailSearchReducer;
