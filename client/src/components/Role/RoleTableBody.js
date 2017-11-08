import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material ui
import { TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";
import Chip from "material-ui/Chip";

const RoleTableBody = ({
  role,
  key
}) => {
  return (
    <TableRow key={key}>
      <TableRowColumn>{role.name}</TableRowColumn>
      <TableRowColumn>{role.description}</TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {role.actions.map( (action, idx) => {
            return <Chip key={idx} style={{ marginRight: 10 }}>{action.label}</Chip>;
          })}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/role_files/${role._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

RoleTableBody.propTypes = {
  role: PropTypes.object.isRequired
};

export default RoleTableBody;
