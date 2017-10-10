import React from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";

const TagCreateBasic = ({
  changedTag,
  validationErrors,
  changeTagLabel,
  changeTagColor
}) => {
  return (
    <div>
      <TextField
        value={changedTag.label}
        onChange={(e, value) => changeTagLabel(value)}
        errorText={validationErrors.label}
        floatingLabelText="タグ名"
        />

        <TextField
          value={changedTag.color}
          onChange={(e, value) => changeTagColor(value)}
          errorText={validationErrors.color}
          floatingLabelText="色"
          />

    </div>
  );
};

TagCreateBasic.propTypes = {
  changedTag: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  changeTagLabel: PropTypes.func.isRequired,
  changeTagColor: PropTypes.func.isRequired
};

export default TagCreateBasic;
