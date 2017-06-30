import React from "react";
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const AppMenu = () => {
  const menus = [
    {name: "home"},
    {name: "summary"},
    {name: "settings"},
    {name: "logout"},
  ];

  return (
    <div className="menu">
      <Menu>
        {menus.map( (menu, idx) => <MenuItem key={idx} primaryText={menu.name} />)}
      </Menu>
    </div>
  );
}

export default AppMenu;
