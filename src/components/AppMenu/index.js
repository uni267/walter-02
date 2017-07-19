import React from "react";
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const AppMenu = ({
  open,
  toggleDrawer
}) => {
  const menus = [
    {name: "ファイル一覧"},
    {name: "管理コンソール"},
  ];

  const renderMenu = (menu, idx) => {
    return (
      <MenuItem
        key={idx}
        onTouchTap={toggleDrawer}
        primaryText={menu.name}
        />
    );
  };
    
  return (
    <div className="menu">
      <Drawer
        docked={false}
        open={open}
        width={200}
        onRequestChange={toggleDrawer}
        >

        {menus.map( (menu, idx) => renderMenu(menu, idx) )}

      </Drawer>
    </div>
  );
};

export default AppMenu;
