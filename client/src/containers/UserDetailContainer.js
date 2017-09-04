import React, { Component } from "react";

// route
import { Link } from "react-router-dom";

// store
import { connect } from "react-redux";

// material
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from "material-ui/AutoComplete";
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from "material-ui/MenuItem";
import SocialGroup from "material-ui/svg-icons/social/group";
import Chip from 'material-ui/Chip';
import Divider from "material-ui/Divider";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

// actions
import {
  requestFetchUser,
  deleteGroupOfUser,
  addGroupOfUser,
  toggleUser,
  changeUserName,
  changeUserEmail,
  changeUserPassword,
  saveUserName,
  saveUserEmail,
  saveUserPassword
} from "../actions";

// components
import NavigationContainer from "./NavigationContainer";

const styles = {
  wrapper: {
    display: "flex"
  },
  cell: {
    width: "30%",
    marginRight: 20
  },
  toggle: {
    maxWidth: 200
  },
  groups: {
    display: "flex"
  },
  groupChip: {
    marginRight: 10
  }
};

class UserDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchUser(
      this.props.match.params.id, this.props.tenant.tenant_id
    );
  }

  renderGroup = (group, idx) => {
    const user_id = this.props.user.data._id;
    const group_id = group._id;

    return (
      <Chip
        key={idx}
        style={styles.groupChip}
        onRequestDelete={() => this.props.deleteGroupOfUser(user_id, group_id)}
        >

        {group.name}
      </Chip>
    );
  };

  render() {
    const _groups = this.props.group.data.filter( group => {
      return !this.props.user.data.groups
        .map( g => g._id )
        .includes(group._id);
    });

    const groups = _groups.map( group => {
      const _id = group._id;
      const text = group.name;
      const value = (
        <MenuItem
          primaryText={group.name}
          leftIcon={<SocialGroup />} />
      );

      return { _id, text, value };
    });

    
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title={`${this.props.user.data.name}の詳細`} />
          <CardText>

            <div style={styles.wrapper}>
              <div style={styles.cell}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <Toggle
                      onToggle={() => this.props.toggleUser(this.props.user.data._id)}
                      style={styles.toggle}
                      label="有効/無効"
                      defaultToggled={this.props.user.data.enabled}
                      />
                    <br />

                    <TextField
                      value={this.props.user.changed.name}
                      onChange={(e, value) => this.props.changeUserName(value)}
                      floatingLabelText="表示名" />

                    <FlatButton
                      label="保存"
                      primary={true}
                      onClick={() => this.props.saveUserName(this.props.user.changed)}
                      style={{ marginLeft: 10 }} />

                    <br />

                    <TextField 
                      value={this.props.user.changed.email}
                      onChange={(e, value) => this.props.changeUserEmail(value)}
                      floatingLabelText="メールアドレス" />

                    <FlatButton
                      label="保存"
                      primary={true}
                      onClick={() => this.props.saveUserEmail(this.props.user.changed)}
                      style={{ marginLeft: 10 }} />

                    <br />

                    <TextField
                      value={this.props.user.changed.password}
                      onChange={(e, value) => this.props.changeUserPassword(value)}
                      type="password"
                      floatingLabelText="パスワード" />

                    <FlatButton
                      label="保存"
                      primary={true}
                      onClick={() => this.props.saveUserPassword(this.props.user.changed)}
                      style={{ marginLeft: 10 }} />

                   <br />

                  </CardText>
                </Card>
              </div>

              <div style={styles.cell}>
                <Card>
                  <CardTitle subtitle="所属グループ" />
                  <CardText>
                    <div style={styles.groups}>
                      {this.props.user.data.groups.map(group => this.renderGroup(group))}
                    </div>

                    <AutoComplete
                      hintText="所属グループを追加"
                      floatingLabelText="グループ名を入力"
                      searchText={this.state.group.text}
                      onTouchTap={() => this.setState({ group: { text: "" } })}
                      onNewRequest={(group) => {
                        this.props.addGroupOfUser(this.props.user.data._id, group._id);
                      }}
                      openOnFocus={true}
                      filter={(text, key) => key.indexOf(text) !== -1}
                      dataSource={groups}
                      />
                  </CardText>
                </Card>
              </div>

            </div>
          </CardText>
          <CardActions>
            <FlatButton label="閉じる" primary={true} href="/users" />
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    tenant: state.tenant,
    group: state.group
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchUser: (user_id, tenant_id) => { 
    dispatch(requestFetchUser(user_id, tenant_id));
  },
  deleteGroupOfUser: (user_id, group_id) => {
    dispatch(deleteGroupOfUser(user_id, group_id));
  },
  addGroupOfUser: (user_id, group_id) => {
    dispatch(addGroupOfUser(user_id, group_id));
  },
  toggleUser: (user_id) => {
    dispatch(toggleUser(user_id));
  },
  changeUserName: (name) => dispatch(changeUserName(name)),
  changeUserEmail: (email) => dispatch(changeUserEmail(email)),
  changeUserPassword: (password) => dispatch(changeUserPassword(password)),
  saveUserName: (user) => dispatch(saveUserName(user)),
  saveUserEmail: (user) => dispatch(saveUserEmail(user)),
  saveUserPassword: (user) => dispatch(saveUserPassword(user))
});

UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer);
export default UserDetailContainer;
