import React from "react";

import MenuItem from "material-ui/MenuItem";

// material icons
import SocialPerson from "material-ui/svg-icons/social/person";
import SocialGroup from "material-ui/svg-icons/social/group";

const personIcon = (<SocialPerson />);
const groupIcon = (<SocialGroup />);

const USER_GROUPS = [
  {
    text: "user01",
    value: (
      <MenuItem
        primaryText="ユーザ 太郎"
        leftIcon={personIcon} />
    )
  },
  {
    text: "user02",
    value: (
      <MenuItem
        primaryText="ユーザ 次郎"
        leftIcon={personIcon} />
    )
  },
  {
    text: "soumu-grp",
    value: (
      <MenuItem
        primaryText="総務グループ"
        leftIcon={groupIcon} />
    )
  }
];

export default USER_GROUPS;
  
