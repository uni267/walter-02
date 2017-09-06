import React from "react";
import PropTypes from "prop-types";

// material
import AutoComplete from "material-ui/AutoComplete";
import Chip from 'material-ui/Chip';
import SocialGroup from "material-ui/svg-icons/social/group";
import MenuItem from "material-ui/MenuItem";

const UserBelongsToGroup = ({
  user,
  groups,
  group,
  clearGroupText,
  deleteGroupOfUser,
  addGroupOfUser
}) => {
  const renderGroup = (group, key) => {
    return (
      <Chip
        key={key}
        style={{ marginRight: 10 }}
        onRequestDelete={() => deleteGroupOfUser(user.data._id, group._id)}
        >

        {group.name}
      </Chip>
    );
    
  };

  const _groups = groups.filter( group => {
    return !user.data.groups
      .map( g => g._id )
      .includes(group._id);
  }).map( group => {
    const _id = group._id;
    const text = group.name;
    const value = (
      <MenuItem
        primaryText={group.name}
        leftIcon={<SocialGroup />} />
    );

    return { _id, text, value };
  });


  return (
    <div>
      <div style={{ display: "flex" }}>
        {user.data.groups.map( group => renderGroup(group) )}
      </div>

      <div>
        <AutoComplete
          hintText="所属グループを追加"
          floatingLabelText="グループ名を入力"
          searchText={group.text}
          onTouchTap={clearGroupText}
          onNewRequest={(group) => {
            addGroupOfUser(user.data._id, group._id);
          }}
          openOnFocus={true}
          filter={(text, key) => key.indexOf(text) !== -1}
          dataSource={_groups}
        />
      </div>
    </div>
  );
};

UserBelongsToGroup.propTypes = {
  user: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  deleteGroupOfUser: PropTypes.func.isRequired,
  addGroupOfUser: PropTypes.func.isRequired
};

export default UserBelongsToGroup;
