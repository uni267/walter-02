import React, { Component } from "react";
import PropTypes from "prop-types";

// material-ui
import SelectField from "material-ui/SelectField";
import Chip from "material-ui/Chip";
import MenuItem from "material-ui/MenuItem";

const styles = {
  row: {
    marginTop: 10,
    display: "flex"
  },
  cell: {
    marginRight: 20,
    width: "20%"
  }
};

const Tag = ({
  file,
  tags,
  requestDelTag,
  requestAddTag,
  triggerSnackbar
}) => {

  const handleDelete = (file_id, tag) => {
    requestDelTag(file, tag);
    triggerSnackbar("タグを削除しました");
  };

  const handleChange = (event, index, value) => {
    requestAddTag(file, value);
    triggerSnackbar("タグを追加しました");
  };

  const renderTag = (tag, idx) => {
    return (
      <Chip
        key={idx}
        style={{marginLeft: 10}}
        onRequestDelete={() => handleDelete(file.id, tag)}
        >
        {tag.label}
      </Chip>
    );
  };

  const renderMenuItem = (tag, idx) => {
    return (
      <MenuItem key={idx} value={tag} primaryText={tag.label} />
    );
  };

  return (
    <div>
      <div style={{...styles.row, display: "flex"}}>
        {file.tags.map( (tag, idx) => renderTag(tag, idx) )}
      </div>

      <SelectField
        floatingLabelText="タグを追加"
        value={""}
        onChange={handleChange} >
        {tags.map( (tag, idx) => renderMenuItem(tag, idx) )}
      </SelectField>
    </div>
  );
};

Tag.propTypes = {
  file: PropTypes.object.isRequired,
  triggerSnackbar: PropTypes.func.isRequired
};

export default Tag;
