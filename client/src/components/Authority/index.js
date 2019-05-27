import React, { Component } from "react";

// material-uis
import AutoComplete from "material-ui/AutoComplete";
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from "material-ui/MenuItem";
import Dialog from "material-ui/Dialog";

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
      },
      deleteDialog: {
        open: false,
        file: {},
        user: {},
        group: {},
        role: {},
        group: {}
      }
    };
  }

  renderAuthorities = (file) => {
    const no_default = file.authorities.filter(auth => auth.is_default || false ).length === 0 // デフォルトauthの設定がない（＝古い形式のデータ）
    return file.authorities.map( (auth, idx) => {
      const deletable = no_default ? auth.users !== undefined && auth.users._id === this.props.session.user_id && auth.role_files.name === 'フルコントロール'
          : auth.is_default || false

      let account;
      let isUser;

      if (auth.users !== undefined && auth.users !== null) {
        account = auth.users;
        isUser = true;
      }
      else if(auth.groups !== undefined && auth.groups !== null) {
        account = auth.groups;
        isUser = false;
      }

      return (
        <div key={idx} style={style.row}>
          <div style={{...style.cell, width: "160px"}}>
            {account.name}
          </div>
          <div style={{...style.cell, width: "160px"}}>
            {auth.role_files.name}
          </div>
          <div style={{...style.cell, width: "120px"}}>
            <RaisedButton
              label="削除"
              disabled={deletable}
              onClick={() => {
                this.setState({
                  deleteDialog: {
                    open: true,
                    file: file,
                    user: isUser ? account : null,
                    group: isUser ? null : account,
                    role: auth.role_files
                  }
                });
              }}
              />
          </div>
        </div>
      );
    });
  }

  render() {
    const roles = this.props.roles.map( role => {
      return {
        text: role.name,
        role: role,
        value: (
          <MenuItem primaryText={role.name} leftIcon={<HardwareSecurity />}/>
        )
      };
    });

    const authorities = this.props.file.authorities
    let users = this.props.users.filter(user => user.enabled).map( user => {
      const disabled = authorities.filter(auth => auth.users && auth.users._id ===  user._id).length > 0
      return {
        text: user.name,
        user: user,
        value: (
          <MenuItem primaryText={user.name} leftIcon={<SocialPerson />} disabled={disabled} />
        )
      };
    });

    users = users.concat( this.props.groups.map( group => {
      const disabled = authorities.filter(auth => auth.groups && auth.groups._id ===  group._id).length > 0
      return {
        text: group.name,
        group: group,
        value: (
          <MenuItem primaryText={group.name} leftIcon={<SocialGroup />} disabled={disabled} />
        )
      };
    }));

    const deleteDialogActions = [
      (
        <FlatButton
          label="削除"
          primary={true}
          onTouchTap={() => {
            this.props.deleteAuthorityToFile(
              this.state.deleteDialog.file,
              this.state.deleteDialog.user,
              this.state.deleteDialog.group,
              this.state.deleteDialog.role
            );

            this.setState({ deleteDialog: { open: false } });
          }}
          />
      ),
      (
        <FlatButton
          label="閉じる"
          primary={false}
          onTouchTap={() => this.setState({ deleteDialog: { open: false } })}
          />
      )
    ];

    let addClickable = this.state.user.text !== "" && this.state.role.text !== "";

    return (
      <div>
        <div style={{ marginLeft: 20, marginBottom: 40 }}>
          <AutoComplete
            style={{ marginRight: 30 }}
            hintText="ユーザ名またはグループ名を入力"
            searchText={this.state.user.text}
            floatingLabelText="ユーザ名またはグループ名を入力"
            onTouchTap={() => this.setState({ user: { text: "" } }) }
            onNewRequest={(text) => {
              this.setState({ user: text });
            }}
            filter={(text, key) => key.indexOf(text) !== -1 }
            openOnFocus={true}
            menuStyle={{
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
            dataSource={users} />

          <AutoComplete
            style={{ marginRight: 30 }}
            hintText="ロールを入力"
            searchText={this.state.role.text}
            floatingLabelText="ロールを入力"
            onTouchTap={() => this.setState({ role: { text: "" } })}
            onNewRequest={(text) => this.setState({ role: text }) }
            filter={(text, key) => key.indexOf(text) !== -1 }
            openOnFocus={true}
            menuStyle={{
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
            dataSource={roles} />

          <RaisedButton
            label="追加"
            primary={addClickable}
            disabled={!addClickable}
            onClick={() => {
              this.props.addAuthorityToFile(
                this.props.file,
                this.state.user.user,
                this.state.user.group,
                this.state.role.role
              );
              this.setState({
                user: {
                  text: ""
                },
                group: {
                  text: ""
                },
                role: {
                  text: ""
                },
              })              
            }} />
        </div>

        <div style={{ marginTop: 20 }}>
          {this.renderAuthorities(this.props.file)}
        </div>

        <Dialog
          title="削除してもよろしいですか"
          open={this.state.deleteDialog.open}
          modal={true}
          actions={deleteDialogActions} >
        </Dialog>

      </div>
    );
  }
}

export default Authority;
