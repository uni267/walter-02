import React, { Component } from "react";

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
  toggleUser
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
    console.log("willmount");
    this.props.requestFetchUser(
      this.props.match.params.id, this.props.tenant.tenant_id);
  }

  handleNameChange = (e, value) => {
    this.props.changeUserName(value);
  };

  handleEmailChange = (e, value) => {
    const user = Object.assign({}, this.state.user);
    user.email = value;
    this.setState({ user: user });
  };

  handlePasswordChange = (e, value) => {
    const user = Object.assign({}, this.state.user);
    user.password = value;
    this.setState({ user: user });
  };

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
    console.log("render");
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
                      defaultToggled={this.props.user.data.enabled} />

                    <br />

                    <TextField
                      value={this.props.user.data.name}
                      onChange={this.handleNameChange}
                      floatingLabelText="表示名" />
                    <br />

                    <TextField 
                      value={this.props.user.data.email}
                      onChange={this.handleEmailChange}
                      floatingLabelText="メールアドレス" />
                    <br />

                    <TextField
                      value={this.props.user.data.password}
                      onChange={this.handlePasswordChange}
                      type="password"
                      floatingLabelText="パスワード" />
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
            <FlatButton label="閉じる" primary={true} />
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
  changeUserName: (name) => {
    dispatch({ type: "CHANGE_USER_NAME", name });
  }
});

UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer);
export default UserDetailContainer;
