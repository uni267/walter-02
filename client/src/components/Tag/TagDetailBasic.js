import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const TagDetailBasic = ({
  changedTag,
  validationErrors,
  changeTagLabel,
  changeTagColor,
  changeTagDescription,
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

        <TextField
          value={changedTag.description}
          onChange={(e, value) => changeTagDescription(value)}
          errorText={validationErrors.description}
          floatingLabelText="備考"
          />

        <FlatButton
          label="保存"
          primary={true}
          onClick={() => saveTagDescription(changedTag)}
          />

    </div>
  );
};

TagDetailBasic.propTypes = {
  tag: PropTypes.object.isRequired
};

export default TagDetailBasic;
