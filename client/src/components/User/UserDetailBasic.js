import React from "react";
import PropTypes from "prop-types";

// material
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const UserDetailBasic = ({
  user,
  toggleUser,
  changeUserName,
  changeUserEmail,
  changeUserPassword,
  saveUserName,
  saveUserEmail,
  saveUserPasswordForce,
  displaySaveButton = true
}) => {
  return (
    <div>
      {displaySaveButton ?
        (
          <Toggle
            onToggle={() => toggleUser(user.data._id)}
            style={{ maxWidth: 200 }}
            label="有効/無効"
            defaultToggled={user.data.enabled}
            />
        ) : null}

      <TextField
        value={user.changed.name}
        onChange={(e, value) => changeUserName(value)}
        errorText={user.errors.name}
        floatingLabelText="表示名"
      />

      {displaySaveButton ? 
       (
         <FlatButton 
           label="保存" 
           primary={true} 
           onClick={() => saveUserName(user.changed)} style={{ marginLeft: 10 }}
           />
       ) : null}

      <TextField 
        value={user.changed.email}
        onChange={(e, value) => changeUserEmail(value)}
        errorText={user.errors.email}
        floatingLabelText="メールアドレス"
      />

      {displaySaveButton ?
       (
         <FlatButton
           label="保存"
           primary={true}
           onClick={() => saveUserEmail(user.changed)}
           style={{ marginLeft: 10 }}
           />
       ) : null}

      <TextField
        value={user.changed.password}
        onChange={(e, value) => changeUserPassword(value)}
        errorText={user.errors.password}
        type="password"
        floatingLabelText="パスワード"
      />

      {displaySaveButton ?
       (
         <FlatButton
           label="保存"
           primary={true}
           onClick={() => saveUserPasswordForce(user.changed)}
           style={{ marginLeft: 10 }} />
       ) : null}

    </div>
  );
};

UserDetailBasic.propTypes = {
  user: PropTypes.object.isRequired,
  toggleUser: PropTypes.func.isRequired,
  changeUserName: PropTypes.func.isRequired,
  changeUserEmail: PropTypes.func.isRequired,
  changeUserPassword: PropTypes.func.isRequired,
  saveUserName: PropTypes.func.isRequired,
  saveUserEmail: PropTypes.func.isRequired
};

export default UserDetailBasic;
