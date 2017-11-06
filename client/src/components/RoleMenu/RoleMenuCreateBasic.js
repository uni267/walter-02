import React from "react";
import PropTypes from "prop-types";

// material
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const RoleMenuCreateBasic = ({
  changedRoleMenu,
  validationErrors,
  roleMenuActions
}) => {
    return (
    <div>
      <TextField
        value={changedRoleMenu.name}
        onChange={(e, value) => roleMenuActions.changeRoleMenuName(value)}
        errorText={validationErrors.name}
        floatingLabelText="メニュー名"
      />

      <TextField
        value={changedRoleMenu.description}
        onChange={(e, value) => roleMenuActions.changeRoleMenuDescription(value)}
        errorText={validationErrors.description}
        floatingLabelText="備考"
      />

    </div>
  );
};

export default RoleMenuCreateBasic;