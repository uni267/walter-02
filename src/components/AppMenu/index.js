import React from "react";
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const AppMenu = ({open}) => {
  const menus = [
    {name: "ファイル一覧"},
    {name: "管理コンソール"},
  ];

  return (
    <div className="menu">
      <Drawer
        open={open}
        width={200}
        openSecondary={true}>
        {menus.map( (menu, idx) => <MenuItem key={idx} primaryText={menu.name} />)}
    </Drawer>
      </div>
  );
}

export default AppMenu;
