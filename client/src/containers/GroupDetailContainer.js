import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from "material-ui/AutoComplete";
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from "material-ui/MenuItem";
import SocialPerson from "material-ui/svg-icons/social/person";
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

// components
import NavigationContainer from "./NavigationContainer";

// actions
import {
  requestFetchGroup,
  requestFetchUsers,
  addGroupOfUser,
  deleteGroupOfUser
} from "../actions";

class GroupDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        text: ""
      }
    };
  }

  componentWillMount() {
    this.props.requestFetchGroup(this.props.match.params.id);
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  renderBelongsToUsers = () => {
    return this.props.group.belongs_to.map( (user, idx) => {
      return (
        <Chip 
          key={idx}
          style={{ marginRight: 10 }}
          onRequestDelete={() => {
            this.props.deleteGroupOfUser(user._id, this.props.group._id);
          }} >
          {user.name}
        </Chip>
      );
    });
  };

  render() {
    const users = this.props.users.filter( user => {
      return !this.props.group.belongs_to
        .map( _user => _user._id )
        .includes( user._id );
    }).map( user => {
      const _id = user._id;
      const text = user.name;
      const value = (
        <MenuItem 
          primaryText={user.name}
          leftIcon={<SocialPerson />} />
      );

      return { _id, text, value };
    });

    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title={`${this.props.group.name}グループの詳細`} />
          <CardText>

            <div style={{ display: "flex" }}>
              <Card style={{ width: "35%", marginRight: 20 }}>
                <CardTitle subtitle="基本情報" />
                <CardText>
                  <TextField
                    value={this.props.group.name}
                    onChange={(e, value) => console.log(value)}
                    floatingLabelText="グループ名"
                  />
                  <FlatButton label="保存" primary={true} />
                  <br />

                  <TextField
                    value={this.props.group.description}
                    onChange={(e, value) => console.log(value)}
                    floatingLabelText="備考"
                  />
                  <FlatButton label="保存" primary={true} />
                </CardText>
              </Card>

              <Card style={{ width: "35%"}} >
                <CardTitle subtitle="所属ユーザ" />
                <CardText>
                  <div style={{ display: "flex" }}>
                    {this.renderBelongsToUsers()}
                  </div>

                  <AutoComplete
                    floatingLabelText="ユーザ名"
                    searchText={this.state.user.text}
                    onTouchTap={() => this.setState({ user: { text: "" }})}
                    onNewRequest={(user) => {
                      this.props.addGroupOfUser(user._id, this.props.group._id);
                      this.setState({ user: { text: "" }});
                    }}
                    openOnFocus={true}
                    filter={ (text, key) => key.indexOf(text) !== -1 }
                    dataSource={users}
                    />
                </CardText>
              </Card>
            </div>

          </CardText>
          <CardActions>
            <FlatButton label="閉じる" primary={true} href="/groups" />
            <FlatButton label="削除" secondary={true} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    group: state.group,
    tenant: state.tenant,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchGroup: (group_id) => dispatch(requestFetchGroup(group_id)),
  requestFetchUsers: (tenant_id) => dispatch(requestFetchUsers(tenant_id)),
  addGroupOfUser: (user_id, group_id) => dispatch(addGroupOfUser(user_id, group_id)),
  deleteGroupOfUser: (user_id, group_id) => dispatch(deleteGroupOfUser(user_id, group_id))
});

GroupDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetailContainer);

export default GroupDetailContainer;
