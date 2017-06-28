import React from "react";
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader } from "material-ui/Card";

const AppMenu = () => {
  const style = {
    display: 'inline-block',
    margin: '16px 32px 16px 0',
  };

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
