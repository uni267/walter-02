import React from "react";
import PropTypes from "prop-types";

import DatePicker from 'material-ui/DatePicker';
import TextField from "material-ui/TextField";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "material-ui/IconButton";
import ContentRemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

const DetailSearch = ({
  menu,
  handleDelete
}) => {
  const textField = (menu) => {
    return (
      <TextField
        onChange={() => console.log("change") }
        floatingLabelText={menu.label}
        hintText={menu.label}
        />
    );
  };

  const datePicker = (menu) => {
    return (
      <DatePicker
        onChange={() => console.log("") }
        floatingLabelText={menu.label}
        hintText={menu.label}
        />
    );
  };

  const selectField = (menu) => {
    return (
      <SelectField
        floatingLabelText={menu.label}
        onChange={() => console.log("change") }
        >

        <MenuItem value={null} primaryText="" />
        <MenuItem value={false} primaryText="No" />
        <MenuItem value={true} primaryText="Yes" />
      </SelectField>
    );
  };

  let searchForm;
  if (menu.type === "string") {
    searchForm = textField;
  }

  if (menu.type === "date") {
    searchForm = datePicker;
  }

  if (menu.type === "boolean") {
    searchForm = selectField;
  }

  return (
    <div style={{display: "flex"}}>

      <IconButton
        style={{marginTop: 23}}
        onClick={() => handleDelete(menu) } >
        <ContentRemoveCircleOutline />
      </IconButton>

      {searchForm(menu)}

    </div>
  );
};

DetailSearch.propTypes = {
  menu: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
};

export default DetailSearch;
