import React from "react";
import PropTypes from "prop-types";

import DatePicker from 'material-ui/DatePicker';
import TextField from "material-ui/TextField";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "material-ui/IconButton";
import ContentRemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

const DetailSearch = ({
  item,
  searchItemNotPick,
  searchValueChange
}) => {
  const textField = (item) => {
    return (
      <TextField
        onChange={(e, value) => searchValueChange(item, value) }
        floatingLabelText={item.key}
        hintText={item.key}
        />
    );
  };

  const datePicker = (item) => {
    return (
      <DatePicker
        onChange={(e, value) => searchValueChange(item, value) }
        floatingLabelText={item.key}
        hintText={item.key}
        />
    );
  };

  const selectField = (item) => {
    return (
      <SelectField
        floatingLabelText={item.key}
        onChange={(e, value) => searchValueChange(item, value) }
        >

        <MenuItem value={null} primaryText="" />
        <MenuItem value={false} primaryText="No" />
        <MenuItem value={true} primaryText="Yes" />
      </SelectField>
    );
  };

  let searchForm;
  switch (item.value_type) {
  case "String":
    searchForm = textField;
    break;
  case "Date":
    searchForm = datePicker;
    break;
  case "Bool":
    searchForm = selectField;
    break;
  default:
    searchForm = textField;
    break;
  }

  return (
    <div style={{display: "flex"}}>

      <IconButton
        style={{marginTop: 23}}
        onClick={() => searchItemNotPick(item) } >
        <ContentRemoveCircleOutline />
      </IconButton>

      {searchForm(item)}

    </div>
  );
};

DetailSearch.propTypes = {
  item: PropTypes.object.isRequired
};

export default DetailSearch;
