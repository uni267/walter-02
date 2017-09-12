const initialState = {
  open: false,
  anchorElement: {},
  items: []
};

const fileDetailSearchReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "TOGGLE_FILE_DETAIL_SEARCH_POPOVER":
    return {
      ...state,
      open: !state.open
    };
  case "FILE_DETAIL_SEARCH_ANCHOR_ELEMENT":
    return {
      ...state,
      anchorElement: action.event.currentTarget
    };
  case "INIT_FILE_DETAIL_SEARCH_ITEMS":
    return {
      ...state,
      items: action.items
    };
  case "SEARCH_ITEM_PICK":
    return {
      ...state,
      items: state.items.map( item => {
        return item._id === action.item._id ?
          { ...item, picked: true } : item;
      })
    };
  case "SEARCH_ITEM_NOT_PICK":
    return {
      ...state,
      items: state.items.map( item => {
        return item._id === action.item._id ?
          { ...item, picked: false } : item;
      })
    };
  default:
    return state;
  }
};

export default fileDetailSearchReducer;
