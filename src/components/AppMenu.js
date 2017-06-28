import React from "react";
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const AppMenu = () => {
  return (
    <div className="menu">
      <Menu>
        <MenuItem primaryText="foo" />
        <MenuItem primaryText="baz" />
        <MenuItem primaryText="bar" />
        <MenuItem primaryText="hoge" />
        <MenuItem primaryText="fuga" />
      </Menu>
    </div>
  );
}

export default AppMenu;
