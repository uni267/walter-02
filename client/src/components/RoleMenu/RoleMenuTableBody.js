import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material ui
import { TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";
import Chip from "material-ui/Chip";


const RoleMenuTableBody = ({
  roleMenu,
  key
}) => {
  return (
    <TableRow key={key}>
      <TableRowColumn>{roleMenu.name}</TableRowColumn>
      <TableRowColumn>{roleMenu.description}</TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex"}}>
          { roleMenu.menus.map( (menus, idx) => {
            return <Chip key={idx} style={{ marginRight: 10 }}>{menus.label}</Chip>;
          })}
        </div>
      </TableRowColumn>
      <TableRowColumn>
          <IconButton containerElement={<Link to={`/role_menus/${roleMenu._id}`} />}>
            <ImageEdit />
          </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

RoleMenuTableBody.propTypes = {
  roleMenu: PropTypes.object.isRequired
};

export default RoleMenuTableBody;