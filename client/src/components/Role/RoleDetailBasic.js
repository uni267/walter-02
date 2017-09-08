import React from "react";
import PropTypes from "prop-types";

// material
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const RoleDetailBasic = ({
  role,
  changedRole,
  validationErrors,
  changeRoleName,
  changeRoleDescription,
  saveRoleName,
  saveRoleDescription
}) => {

  return (
    <div>
      <TextField
        value={changedRole.name}
        onChange={(e, value) => changeRoleName(value)}
        errorText={validationErrors.name}
        floatingLabelText="ロール名"
        />

      <FlatButton
        label="保存"
        primary={true}
        onClick={() => saveRoleName(changedRole)}
        />

      <TextField
        value={changedRole.description}
        onChange={(e, value) => changeRoleDescription(value)}
        errorText={validationErrors.description}
        floatingLabelText="備考"
        />

      <FlatButton
        label="保存"
        primary={true}
        onClick={() => saveRoleDescription(changedRole)}
        />

    </div>
  );
};

RoleDetailBasic.propTypes = {
  role: PropTypes.object.isRequired,
  changedRole: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  changeRoleName: PropTypes.func.isRequired,
  changeRoleDescription: PropTypes.func.isRequired,
  saveRoleName: PropTypes.func,
  saveRoleDescription: PropTypes.func
};

export default RoleDetailBasic;
