import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material
import {
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";

const UserTableBody = ({ user }) => {
  const renderGroups = (groups) => {
    return groups.map( (group, idx)  => (
      <Chip key={idx} style={{ marginRight: 10 }}>
        {group.name}
      </Chip>
    ));
  };

  return (
    <TableRow>
      <TableRowColumn>
        {user.enabled ? "有効" : "無効"}
      </TableRowColumn>
      <TableRowColumn>
        {user.name}
      </TableRowColumn>
      <TableRowColumn>
        {user.email}
      </TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {renderGroups(user.groups)}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/users/${user._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};
UserTableBody.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserTableBody;
