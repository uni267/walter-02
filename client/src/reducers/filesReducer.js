const filesReducer = (state = [], action) => {
  switch ( action.type ) {

  case "INIT_FILES":
    return action.files.map( file => ({ ...file, checked: false }));

  case "INIT_NEXT_FILES":
    return state.concat(action.files.map( file => ({ ...file, checked: false })));

  case "TOGGLE_FILE_CHECK":
    return state.map( file => {
      return file._id === action.file._id
        ? { ...file, checked: !action.file.checked } : file;
    });

  case "TOGGLE_FILE_CHECK_ALL":
    return action.value
      ? state.map( file => ({ ...file, checked: true }) )
      : state.map( file => ({ ...file, checked: false }) );

  case "SORT_FILE":
    let _state = state.slice();

    _state.sort( (a, b) => {
      if (action.desc) {
        return a[action.sorted] > b[action.sorted];
      } else {
        return a[action.sorted] < b[action.sorted];
      }
    });

    return _state;
    
  case "ADD_AUTHORITY":
    return state.map(file => {
      if (file.id === action.file_id) {

        const next_authority_id = file.authorities.slice()
              .sort( (a, b) => a.id < b.id)[0].id + 1;

        const addAuthority = {
          id: next_authority_id,
          user: { ...action.user, is_owner: false },
          role: action.role
        };

        return {
          ...file,
          authorities: [...file.authorities, addAuthority]
        };

      }

      return file;
    });

  case "DELETE_AUTHORITY":
    return state.map(file => {
      if (Number(file.id) === Number(action.file_id)) {
        const authorities = file.authorities
              .filter(auth => Number(auth.id) !== Number(action.authority_id));

        return {...file, authorities};
      }
      return file;
    });

  case "COPY_FILE":
    const nextFileId = state.slice().sort((a,b) => b.id - a.id)[0].id + 1;
    let file = {...action.file, dir_id: action.dir_id};
    file = {...file, id: nextFileId};
    return [...state, file];

  default:
    return state;
  }
};

export default filesReducer;
