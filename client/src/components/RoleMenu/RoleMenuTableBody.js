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
  menu,
  key
}) => {
  return (
    <TableRow key={key}>
      <TableRowColumn>{menu.name}</TableRowColumn>
      <TableRowColumn>{menu.description}</TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex"}}>
          {menu.menus.map( (menu, idx) => {
            return <Chip key={idx} style={{ marginRight: 10 }}>{menu.label}</Chip>;
          })}
        </div>
      </TableRowColumn>
      <TableRowColumn>
          <IconButton containerElement={<Link to={`/role_menus/${menu._id}`} />}>
            <ImageEdit />
          </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

RoleMenuTableBody.propTypes = {
  menu: PropTypes.object.isRequired
};

export default RoleMenuTableBody;