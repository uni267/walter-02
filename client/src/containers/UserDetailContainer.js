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
  addGroupOfUser
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
        text: "",
        value: {}
      },
      user: {
        name: "",
        email: "",
        password: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchUser(
      this.props.match.params.id, this.props.tenant.tenant_id);

    this.setState({
      user: {...this.props.user.data, password: ""}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id
        || this.props.user.data !== nextProps.user.data
        || this.props.group.data !== nextProps.group.data)
    {

      this.props.requestFetchUser(
        this.props.match.params.id, this.props.tenant.tenant_id);

      this.setState({
        user: {...this.props.user.data, password: ""}
      });
    }
  }

  handleNameChange = (e, value) => {
    const user = Object.assign({}, this.state.user);
    user.name = value;
    this.setState({ user: user });
    console.log(this.state.user);
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

    const user = this.props.user.data;

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title={`${user.name}の詳細`} />
          <CardText>

            <div style={styles.wrapper}>
              <div style={styles.cell}>
                <Card>
                  <CardTitle subtitle="基本情報" />
                  <CardText>
                    <Toggle
                      style={styles.toggle}
                      label="有効/無効"
                      defaultToggled={user.enabled} />

                    <br />

                    <TextField
                      value={this.state.user.name}
                      onChange={this.handleNameChange}
                      floatingLabelText="表示名" />
                    <br />

                    <TextField 
                      value={this.state.user.email}
                      onChange={this.handleEmailChange}
                      floatingLabelText="メールアドレス" />
                    <br />

                    <TextField
                      value={this.state.user.password}
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
                      {user.groups.map(group => this.renderGroup(group))}
                    </div>

                    <AutoComplete
                      hintText="所属グループを追加"
                      floatingLabelText="グループ名を入力"
                      searchText={this.state.group.text}
                      onTouchTap={() => this.setState({ group: { text: "" } })}
                      onNewRequest={(group) => {
                        this.setState({ 
                          group: {
                            _id: group._id,
                            text: group.text,
                            value: group.value
                          }
                        });

                        console.log(group);
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
  }
});

UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer);
export default UserDetailContainer;
