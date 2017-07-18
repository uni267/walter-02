import React from "react";
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const AppMenu = ({open}) => {
  const menus = [
    {name: "ファイル一覧"},
    {name: "管理コンソール"},
  ];

  const renderMenu = (menu, idx) => {
    return <MenuItem key={idx} primaryText={menu.name} />;
  };
    
  return (
    <div className="menu">
      <Drawer
        open={open}
        width={200}
        openSecondary={true}>

        {menus.map( (menu, idx) => renderMenu(menu, idx) )}

      </Drawer>
    </div>
  );
};

export default AppMenu;
