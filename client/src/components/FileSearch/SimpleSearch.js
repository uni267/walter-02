import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";

const SimpleSearch = ({
  hintText,
  history,
  actions
}) => {
  let searchValue = "";

  const handleKeyDown = (event) => {
    return event.key === "Enter"
      ? actions.searchFileSimple(searchValue.getValue(), history)
      : null;
  };

  return (
    <div>
      <TextField
        ref={(input) => searchValue = input}
        style={{width: 270}}
        onKeyDown={handleKeyDown}
        hintText={hintText}
        floatingLabelText="簡易検索"
        />
    </div>
  );
};

SimpleSearch.propTypes = {
  searchFileSimple: PropTypes.func.isRequired,
  hintText: PropTypes.string
};

export default SimpleSearch;

