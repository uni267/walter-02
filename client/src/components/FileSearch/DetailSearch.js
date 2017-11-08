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
  history,
  tags,
  searchValues,
  actions
}) => {
  const textField = (item) => {
    let valueItem = searchValues.filter( search => search._id === item._id)[0];
    const value = valueItem === undefined ? "" : valueItem.value;

    return (
      <TextField
        onChange={(e, value) => actions.searchValueChange(item, value) }
        value={value}
        onKeyPress={ e => {
          if (e.key === "Enter") actions.searchFileDetail(history);
        }}
        floatingLabelText={item.label}
        hintText={item.label}
        />
    );
  };

  const datePicker = (item) => {
    const selectValue = searchValues.filter( value => value._id === item._id );
    const value = selectValue[0] === undefined
          ? null
          : selectValue[0].value;

    return (
      <DatePicker
        onChange={(e, value) => {
          actions.searchValueChange(item, value);
          actions.searchFileDetail(history);
        }}
        value={value}
        floatingLabelText={item.key}
        hintText={item.key}
        />
    );
  };

  const selectField = (item) => {
    const selectValue = searchValues.filter( value => value._id === item._id );

    const value = selectValue[0] === undefined
          ? null
          : selectValue[0].value;

    return (
      <SelectField
        floatingLabelText={item.key}
        value={value}
        onChange={(e, idx, value) => {
          actions.searchValueChange(item, value);
          actions.searchFileDetail(history);
        }}
        >

        <MenuItem value={null} primaryText="" />
        <MenuItem value={false} primaryText="No" />
        <MenuItem value={true} primaryText="Yes" />
      </SelectField>
    );
  };

  const tagField = (item) => {
    const handleChange = (event, index, value) => {
      actions.searchValueChange(item, value);
      actions.searchFileDetail(history);
    };

    const selectValue = searchValues.filter( value => value._id === item._id );

    const value = selectValue[0] === undefined
          ? null
          : selectValue[0].value;

    return (
      <SelectField
        floatingLabelText="タグを選択"
        value={value}
        onChange={handleChange} >
        {tags.map( (tag, idx) => (
          <MenuItem value={tag._id} primaryText={tag.label} />
        ))}
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
  case "Tag":
    searchForm = tagField;
    break;
  default:
    searchForm = textField;
    break;
  }

  return (
    <div style={{display: "flex"}}>

      <IconButton
        style={{marginTop: 23}}
        onClick={() => actions.searchItemNotPick(item) } >
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
