import React from "react";

import MenuItem from "material-ui/MenuItem";

// material icons
import SocialPerson from "material-ui/svg-icons/social/person";
import SocialGroup from "material-ui/svg-icons/social/group";

const personIcon = (<SocialPerson />);
const groupIcon = (<SocialGroup />);

const USER_GROUPS = [
  {
    text: "ユーザ 太郎",
    user: { id: 1, name: "user01", name_jp: "ユーザ 太郎" },
    value: (
      <MenuItem
        primaryText="ユーザ太郎"
        leftIcon={personIcon} />
    )
  },
  {
    text: "ユーザ 次郎",
    user: { id: 2, name: "user02", name_jp: "ユーザ 次郎" },
    value: (
      <MenuItem
        primaryText="ユーザ 次郎"
        leftIcon={personIcon} />
    )
  },
  {
    text: "総務グループ",
    user: { id: 1, name: "grp_soumu", name_jp: "総務グループ" },
    value: (
      <MenuItem
        primaryText="総務グループ"
        leftIcon={groupIcon} />
    )
  }
];

export default USER_GROUPS;
  
