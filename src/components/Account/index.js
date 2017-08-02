import React from "react";

// material ui
import TextField from "material-ui/TextField";

const Account = () => {
  return (
    <div>
      <TextField
        hintText=""
        floatingLabelText="current password"
        type="password"
        />

      <br />
      
      <TextField
        hintText=""
        floatingLabelText="new password"
        type="password"
        />
    </div>
  );
};

export default Account;
