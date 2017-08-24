import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";

const SimpleSearch = ({
  searchWord,
  handleChange
}) => {
  return (
    <div>
      <TextField
        style={{width: 270}}
        value={searchWord.value}
        onChange={handleChange}
        hintText="ファイル名、メタ情報"
        floatingLabelText="簡易検索"
        />
    </div>
  );
};

SimpleSearch.propTypes = {
  searchWord: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default SimpleSearch;
