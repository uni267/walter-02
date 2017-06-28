import React from "react";
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader } from "material-ui/Card";

const AppMenu = () => {
  return (
    <div className="menu">
    <Card>
    <CardHeader title="menu" />
    <Menu>
    <MenuItem primaryText="foo" />
    </Menu>
    </Card>
    </div>
  );
}

export default AppMenu;
