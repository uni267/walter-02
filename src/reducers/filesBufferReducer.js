import moment from "moment";

const filesBufferReducer = (state = [], action) => {
  switch (action.type) {
  case "PUSH_FILE_TO_BUFFER":
    return [
      ...state,
      {
        name: action.name,
        dir_id: action.dir_id,
        modified: moment().format("YYYY-MM-DD HH:mm"),
        owner: "user01",
        is_dir: false,
        is_display: true
      }
    ];
  default:
    return state;
  }
};

export default filesBufferReducer;
