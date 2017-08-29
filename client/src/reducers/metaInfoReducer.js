const metaInfoReducer = (state = [], action) => {
  switch ( action.type ) {
  case "INIT_META_INFO":
    return action.meta_infos;
  default:
    return state;
  }
};

export default metaInfoReducer;
