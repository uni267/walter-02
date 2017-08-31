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

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

// actions
import { requestFetchUser } from "../actions";

// components
import NavigationContainer from "./NavigationContainer";


const styles = {
  formWrapper: {
    width: "30%"
  },
  toggle: {
    maxWidth: 200
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
      this.props.match.params.id, this.props.tenant.tenant_id);
  }

  render() {
    const groups = this.props.group.data.map(group => {
      const text = group.name;
      const icon = <SocialGroup />;
      const value = (
        <MenuItem
          primaryText={group.name}
          leftIcon={<SocialGroup />} />
      );

      return { text, value };

    });

    if (!this.props.user.data._id) return <div><NavigationContainer /></div>;
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="ユーザ詳細" subtitle={this.props.user.data.name} />
          <CardText>

            <div style={styles.formWrapper}>

              <Toggle
                style={styles.toggle}
                label="有効/無効"
                defaultToggled={this.props.user.data.enabled} />

              <br />

              <TextField
                defaultValue={this.props.user.data.name}
                hintText="クラウド 太郎"
                floatingLabelText="表示名" />
              <br />

              <TextField 
                defaultValue={this.props.user.data.email}
                hintText="cloud@example.jp"
                floatingLabelText="メールアドレス" />
              <br />

              <TextField
                type="password"
                floatingLabelText="パスワード" />
              <br />

              <AutoComplete
                hintText="所属グループを追加"
                floatingLabelText="グループ名を入力"
                searchText={this.state.group.text}
                onTouchTap={() => this.setState({ group: { text: "" } })}
                onNewRequest={(text) => this.setState({ group: { text: text } })}
                openOnFocus={true}
                filter={(text, key) => key.indexOf(text) !== -1}
                dataSource={groups}
                />

            </div>

          </CardText>
          <CardActions>
            <FlatButton label="保存" primary={true} />
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
  }
});

UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer);
export default UserDetailContainer;
