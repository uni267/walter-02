import React, { Component } from "react";

// material-uis
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// mocks
import USER_GROUPS from "../../mock-user-groups";
import ROLES from "../../mock-roles";

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
    console.log(this.state);
  }

  renderAuthorities(file) {
    return file.authorities.map( (auth, idx) => {
      return (
        <Card key={idx}>
          <CardText>
            <div>{auth.user.name_jp}</div>
            <div>{auth.role.name}</div>
          </CardText>
        </Card>
      );
    });
  }

  render() {
    let addClickable = this.state.user.text !== "" && this.state.role.text !== "";

    return (
      <div>
        <AutoComplete
          hintText="ユーザ名またはグループ名を入力"
          searchText={this.state.user.text}
          floatingLabelText="ユーザ名またはグループ名を入力"
          onTouchTap={this.onUserClick}
          onNewRequest={this.onUserRequestNew}
          filter={this.autoCompleteFilter}
          openOnFocus={true}
          dataSource={USER_GROUPS} />

        <AutoComplete
          hintText="ロールを入力"
          searchText={this.state.role.text}
          floatingLabelText="ロールを入力"
          onTouchTap={this.onRoleClick}
          onNewRequest={this.onRoleRequestNew}
          filter={this.autoCompleteFilter}
          openOnFocus={true}
          dataSource={ROLES} />

        <RaisedButton
          label="追加"
          primary={addClickable}
          disabled={!addClickable}
          onTouchTap={this.onAddClick} />
        
        <Divider />

        <div>
          {this.renderAuthorities(this.props.file)}
        </div>
      </div>
    );
  }
}

export default Authority;


