import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const TagDetailBasic = ({
  changedTag,
  validationErrors,
  actions
}) => {
  return (
    <div>
      <TextField 
        value={changedTag.label}
        onChange={(e, value) => actions.changeTagLabel(value)}
        errorText={validationErrors.label}
        floatingLabelText="タグ名"
        />
        
        <FlatButton
          label="保存"
          primary={true}
          onClick={() => actions.saveTagLabel(changedTag)}
          />

        <TextField
          value={changedTag.color}
          onChange={(e, value) => actions.changeTagColor(value)}
          errorText={validationErrors.color}
          floatingLabelText="色"
          />

        <FlatButton
          label="保存"
          primary={true}
          onClick={() => actions.saveTagColor(changedTag)}
          />

    </div>
  );
};

TagDetailBasic.propTypes = {
  changedTag: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default TagDetailBasic;
