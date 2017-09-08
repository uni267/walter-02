import React from "react";
import PropTypes from "prop-types";

import Chip from "material-ui/Chip";

const RoleAction = ({
  role,
  deleteRoleOfAction
}) => {
  return (
    <div>
      {role.actions.map( (action, idx) => {
        return (
          <Chip 
            key={idx}
            style={{ marginRight: 10 }}
            onRequestDelete={() => deleteRoleOfAction(role._id, action._id)}
            >

            {action.label}
          </Chip>
        );
      })}
    </div>
  );
};

RoleAction.propTypes = {
  actions: PropTypes.array.isRequired
};

export default RoleAction;
