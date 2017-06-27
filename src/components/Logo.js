import React from "react";
import AppBar from "material-ui/AppBar";
import Card from "material-ui/Card";

const Logo = () => {
  const title = "walter";
  return (
    <div className="logo">
      <Card>
        <AppBar
          title={title}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
      </Card>
    </div>
  );
};

export default Logo;
