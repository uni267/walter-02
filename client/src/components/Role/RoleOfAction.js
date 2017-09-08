import React from "react";
import PropTypes from "prop-types";

import Chip from "material-ui/Chip";

const RoleOfAction = ({
  role,
  deleteRoleOfAction
}) => {
  const renderActions = (actions) => {
    return actions.map( (action, idx) => {
      return (
        <Chip 
          key={idx}
          style={{ marginRight: 10 }}
          onRequestDelete={() => deleteRoleOfAction(role._id, action._id)}
          >
          
          {action.label}
        </Chip>
      );
    });
  };

  return (
    <div>
      <div>
        {renderActions(role.actions)}
      </div>

      <div>
        
      </div>
    </div>
  );
};

RoleOfAction.propTypes = {
  actions: PropTypes.array.isRequired
};

export default RoleOfAction;
