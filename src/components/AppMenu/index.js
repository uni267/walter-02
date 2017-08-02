import React from "react";
import PropTypes from "prop-types";

// material ui
import Drawer from 'material-ui/Drawer';
import MenuItem from "material-ui/MenuItem";

const AppMenu = ({
  open,
  menus,
  toggle
}) => {
  const renderMenu = (menu, idx) => {
    return (
      <MenuItem
        key={idx}
        onTouchTap={toggle}
        primaryText={menu.name} />
    );
  };

  return (
    <Drawer
      docked={false}
      open={open}
      width={200}
      onRequestChange={toggle}
      >

      {menus.map( (menu, idx) => renderMenu(menu, idx) )}

    </Drawer>
  );
};

AppMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  menus: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired
};

export default AppMenu;
