import React from "react";

import MenuItem from "material-ui/MenuItem";
import HardwareSecurity from "material-ui/svg-icons/hardware/security";

const roleIcon = (<HardwareSecurity />);

const ROLES = [
  {
    text: "読み取り専用",
    value: (
      <MenuItem
        primaryText="読み取り専用"
        leftIcon={roleIcon} />
    )
  },
  {
    text: "読み取り、編集可能",
    value: (
      <MenuItem
        primaryText="読み取り、編集可能"
        leftIcon={roleIcon} />
    )
  },
  {
    text: "フルコントロール",
    value: (
      <MenuItem
        primaryText="フルコントロール"
        leftIcon={roleIcon} />
    )
  }

];

export default ROLES;
