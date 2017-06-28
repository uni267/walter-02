import React from "react";
import AppBar from "material-ui/AppBar";

const Logo = () => {
  const title = "walter";
  return (
    <div className="logo">
      <AppBar
        title={title}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    </div>
  );
};

export default Logo;
