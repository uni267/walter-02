import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const TagDetailBasic = ({
  changedTag,
  validationErrors,
  changeTagLabel,
  changeTagColor,
  saveTagLabel,
  saveTagColor,
  saveTagDescription
}) => {
  return (
    <div>
      <TextField 
        value={changedTag.label}
        onChange={(e, value) => changeTagLabel(value)}
        errorText={validationErrors.label}
        floatingLabelText="タグ名"
        />
        
        <FlatButton
          label="保存"
          primary={true}
          onClick={() => saveTagLabel(changedTag)}
          />

        <TextField
          value={changedTag.color}
          onChange={(e, value) => changeTagColor(value)}
          errorText={validationErrors.color}
          floatingLabelText="色"
          />

        <FlatButton
          label="保存"
          primary={true}
          onClick={() => saveTagColor(changedTag)}
          />

    </div>
  );
};

TagDetailBasic.propTypes = {
  tag: PropTypes.object.isRequired
};

export default TagDetailBasic;
