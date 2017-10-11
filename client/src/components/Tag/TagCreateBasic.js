import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";

const TagCreateBasic = ({
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

        <TextField
          value={changedTag.color}
          onChange={(e, value) => actions.changeTagColor(value)}
          errorText={validationErrors.color}
          floatingLabelText="色"
          />

    </div>
  );
};

TagCreateBasic.propTypes = {
  changedTag: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default TagCreateBasic;
