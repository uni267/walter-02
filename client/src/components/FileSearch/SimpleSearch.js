import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";

const SimpleSearch = ({
  searchFileSimple
}) => {
  let searchValue = "";

  const handleKeyDown = (event) => {
    return event.key === "Enter"
      ? searchFileSimple(searchValue.getValue())
      : null;
  };

  return (
    <div>
      <TextField
        ref={(input) => searchValue = input}
        style={{width: 270}}
        onKeyDown={handleKeyDown}
        hintText="ファイル名、メタ情報"
        floatingLabelText="簡易検索"
        />
    </div>
  );
};

SimpleSearch.propTypes = {
  searchFileSimple: PropTypes.func.isRequired
};

export default SimpleSearch;

