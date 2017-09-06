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
  saveUserPassword
}) => {
  return (
    <div>
      <Toggle
        onToggle={() => toggleUser(user.data._id)}
        style={{ maxWidth: 200 }}
        label="有効/無効"
        defaultToggled={user.data.enabled}
      />
      <br />

      <TextField
        value={user.changed.name}
        onChange={(e, value) => changeUserName(value)}
        floatingLabelText="表示名"
      />

      <FlatButton
        label="保存"
        primary={true}
        onClick={() => saveUserName(user.changed)}
        style={{ marginLeft: 10 }}
      />

      <br />

      <TextField 
        value={user.changed.email}
        onChange={(e, value) => changeUserEmail(value)}
        floatingLabelText="メールアドレス"
      />

      <FlatButton
        label="保存"
        primary={true}
        onClick={() => saveUserEmail(user.changed)}
        style={{ marginLeft: 10 }}
      />

      <br />

      <TextField
        value={user.changed.password}
        onChange={(e, value) => changeUserPassword(value)}
        type="password"
        floatingLabelText="パスワード"
      />

      <FlatButton
        label="保存"
        primary={true}
        onClick={() => saveUserPassword(user.changed)}
        style={{ marginLeft: 10 }} />
      <br />

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
