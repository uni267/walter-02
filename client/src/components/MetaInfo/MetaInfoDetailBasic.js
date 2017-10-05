import React from "react";
import PropTypes from "prop-types";

// material ui
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const MetaInfoDetailBasic = ({
  metaInfo,
  changedMetaInfo,
  validationErrors,
  valueTypes,
  changeMetaInfoKey,
  changeMetaInfoValueType,
  displaySaveButton = true
}) => {
  const saveKeyBtn = (
    displaySaveButton
      ? (
        <FlatButton
          label="保存"
          primary={true}
          onClick={() => true}
        />
      )
    : null
  );

  return (
    <div>
      <TextField
        value={changedMetaInfo.key}
        onChange={(e, value) => changeMetaInfoKey(value)}
        floatingLabelText="key名"
        errorText={validationErrors.key}
        />
      
        {saveKeyBtn}

      <SelectField
        floatingLabelText="データ型"
        disabled={displaySaveButton}
        value={changedMetaInfo.value_type}
        errorText={validationErrors.value_type}
        onChange={(e, value) => changeMetaInfoValueType(valueTypes[value].name)}>

        {valueTypes.map( (type, id) => (
          <MenuItem value={type.name} primaryText={type.name} />
        ))}

      </SelectField>

    </div>
  );
};

MetaInfoDetailBasic.propTypes = {
  metaInfo: PropTypes.object.isRequired
};

export default MetaInfoDetailBasic;
