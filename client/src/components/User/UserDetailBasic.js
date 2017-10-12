import React from "react";
import PropTypes from "prop-types";

// material
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const UserDetailBasic = ({
  user,
  actions,
  displaySaveButton = true
}) => {
  return (
    <div>
      {displaySaveButton ?
        (
          <Toggle
            onToggle={() => actions.toggleUser(user.data._id)}
            thumbStyle={{ backgroundColor: "#ffcccc" }}
            trackStyle={{ backgroundColor: "#ff9d9d" }}
            style={{ maxWidth: 200 }}
            label="無効/有効"
            defaultToggled={user.data.enabled}
            />
        ) : null}

      <TextField
        value={user.changed.account_name}
        onChange={(e, value) => actions.changeUserAccountName(value)}
        errorText={user.errors.account_name}
        floatingLabelText="アカウント名"
      />

      {displaySaveButton ?
       (
         <FlatButton
           label="保存"
           primary={true}
           onClick={() => actions.saveUserAccountName(user.changed)}
           style={{ marginLeft: 10 }}
           />
       ) : null}

      <TextField
        value={user.changed.name}
        onChange={(e, value) => actions.changeUserName(value)}
        errorText={user.errors.name}
        floatingLabelText="表示名"
      />

      {displaySaveButton ? 
       (
         <FlatButton 
           label="保存" 
           primary={true} 
           onClick={() => actions.saveUserName(user.changed)}
           style={{ marginLeft: 10 }}
           />
       ) : null}

      <TextField 
        value={user.changed.email}
        onChange={(e, value) => actions.changeUserEmail(value)}
        errorText={user.errors.email}
        floatingLabelText="メールアドレス"
      />

      {displaySaveButton ?
       (
         <FlatButton
           label="保存"
           primary={true}
           onClick={() => actions.saveUserEmail(user.changed)}
           style={{ marginLeft: 10 }}
           />
       ) : null}

      <TextField
        value={user.changed.password}
        onChange={(e, value) => actions.changeUserPassword(value)}
        errorText={user.errors.password}
        type="password"
        floatingLabelText="パスワード"
      />

      {displaySaveButton ?
       (
         <FlatButton
           label="保存"
           primary={true}
           onClick={() => actions.saveUserPasswordForce(user.changed)}
           style={{ marginLeft: 10 }} />
       ) : null}

    </div>
  );
};

UserDetailBasic.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  displaySaveButton: PropTypes.bool
};

export default UserDetailBasic;
