import React, { Component } from "react";

// material-uis
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from "material-ui/Avatar";
import ListItem from 'material-ui/List/ListItem';
import MenuItem from "material-ui/MenuItem";

// icons
import SocialPerson from "material-ui/svg-icons/social/person";
import SocialGroup from "material-ui/svg-icons/social/group";
import HardwareSecurity from "material-ui/svg-icons/hardware/security";

const style = {
  row: {
    display: "flex",
    width: "100%",
    backgroundColor: "inherit",
    marginLeft: 20
  },

  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 62,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    borderBottom: "1px solid lightgray"
  },

  inputWrapper: {
    marginLeft: 20,
    marginBottom: 40
  },

  autoComplete: {
    marginRight: 30
  },

  roleListWrapper: {
    marginTop: 20
  }
};

class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        text: ""
      },
      role: {
        text: ""
      }
    };

    this.onUserRequestNew = this.onUserRequestNew.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.onRoleRequestNew = this.onRoleRequestNew.bind(this);
    this.onRoleClick = this.onRoleClick.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);

    this.roles = props.roles.map(role => {
      const text = role.name;
      const icon = <HardwareSecurity />;
      const value = (
        <MenuItem
          primaryText={role.name}
          leftIcon={icon} />
      );

      return { text, role, value };
    });

    this.users = props.users.map(user => {
      const text = user.name_jp;
      const icon = user.type === "user" ? <SocialPerson /> : <SocialGroup />;
      const primaryText = user.name_jp;

      const value = (
        <MenuItem primaryText={primaryText} leftIcon={icon} />
      );

      return { text, user, value };
    });
  }

  autoCompleteFilter(searchText, key) {
    return key.indexOf(searchText) !== -1;
  }

  onUserRequestNew(searchText) {
    this.setState({ user: searchText });
  }

  onUserClick() {
    this.setState({
      user: { text: "" }
    });
  }

  onRoleRequestNew(searchText) {
    this.setState({ role: searchText });
  }

  onRoleClick() {
    this.setState({
      role: { text: "" }
    });
  }

  onAddClick() {
    this.props.addAuthority(
      this.props.file.id,
      this.state.user.user,
      this.state.role.role
    );
    this.props.triggerSnackbar("権限を追加しました");
    this.setState({
      user: { text: "" },
      role: { text: "" }
    });
  }

  onDeleteClick(file_id, auth_id) {
    this.props.deleteAuthority(file_id, auth_id);
    this.props.triggerSnackbar("権限を削除しました");    
  }

  renderAuthorities(file) {
    return file.authorities.map( (auth, idx) => {
      const deleteDisabled = auth.user.is_owner;

      return (
        <div style={style.row}>
          <div style={{...style.cell, width: "160px"}}>
            {auth.user.name_jp}
            {auth.user.is_owner ? "(所有者)" : null}
          </div>
          <div style={{...style.cell, width: "160px"}}>
            {auth.role.name}
          </div>
          <div style={{...style.cell, width: "120px"}}>
            <RaisedButton
              label="削除"
              disabled={deleteDisabled}              
              onClick={() => this.onDeleteClick(file.id, auth.id)}
              />
          </div>
        </div>
      );
    });
  }

  render() {
    let addClickable = this.state.user.text !== "" && this.state.role.text !== "";

    return (
      <div>
        <div style={style.inputWrapper}>
          <AutoComplete
            style={style.autoComplete}
            hintText="ユーザ名またはグループ名を入力"
            searchText={this.state.user.text}
            floatingLabelText="ユーザ名またはグループ名を入力"
            onTouchTap={this.onUserClick}
            onNewRequest={this.onUserRequestNew}
            filter={this.autoCompleteFilter}
            openOnFocus={true}
            dataSource={this.users} />

          <AutoComplete
            style={style.autoComplete}
            hintText="ロールを入力"
            searchText={this.state.role.text}
            floatingLabelText="ロールを入力"
            onTouchTap={this.onRoleClick}
            onNewRequest={this.onRoleRequestNew}
            filter={this.autoCompleteFilter}
            openOnFocus={true}
            dataSource={this.roles} />

          <RaisedButton
            label="追加"
            primary={addClickable}
            disabled={!addClickable}
            onTouchTap={this.onAddClick} />
        </div>
        
        <div style={style.roleListWrapper}>
          {this.renderAuthorities(this.props.file)}
        </div>
      </div>
    );
  }
}

export default Authority;
