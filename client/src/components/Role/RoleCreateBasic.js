import React from "react";
import PropTypes from "prop-types";

// material
import TextField from "material-ui/TextField";

const RoleCreateBasic = ({
  changedRole,
  validationErrors,
  changeRoleName,
  changeRoleDescription
}) => {
  return (
    <div>
      <TextField
        value={changedRole.name}
        onChange={(e, value) => changeRoleName(value)}
        errorText={validationErrors.name}
        floatingLabelText="ロール名"
        />

      <TextField
        value={changedRole.description}
        onChange={(e, value) => changeRoleDescription(value)}
        errorText={validationErrors.description}
        floatingLabelText="備考"
        />

    </div>
  );
};

RoleCreateBasic.propTypes = {
  changedRole: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  changeRoleName: PropTypes.func.isRequired,
  changeRoleDescription: PropTypes.func.isRequired
};

export default RoleCreateBasic;
