import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material ui
import { TableRow, TableRowColumn } from 'material-ui/Table';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";

const GroupTableBody = ({ group, key }) => {
  const renderUser = (user, key) => {
    return (
      <Chip key={key} style={{ marginRight: 10 }}>
        {user.name}
      </Chip>
    );
  };

  return (
    <TableRow>
      <TableRowColumn>{group.name}</TableRowColumn>
      <TableRowColumn>{group.description}</TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {group.belongs_to.map( (user, idx) => renderUser(user, idx) )}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/groups/${group._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

GroupTableBody.propTypes = {
  group: PropTypes.object.isRequired
};

export default GroupTableBody;
