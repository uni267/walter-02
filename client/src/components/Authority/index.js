import React, { Component } from "react";

// material-uis
import AutoComplete from "material-ui/AutoComplete";
import RaisedButton from 'material-ui/RaisedButton';
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
      },
      deleteDialog: {
        open: false,
        file_id: null,
        auth_id: null
      }
    };

    this.roles = this.props.roles.map(role => {
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

  onAddClick = () => {
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

  onDeleteClick = (file_id, auth_id) => {
    this.props.deleteAuthority(file_id, auth_id);
    this.props.triggerSnackbar("権限を削除しました");    
  }

  renderAuthorities = (file) => {
    return file.authorities.map( (auth, idx) => {
      const deleteDisabled = auth.user.is_owner;

      return (
        <div key={idx} style={style.row}>
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
              onClick={() => this.setState({
                deleteDialog: {
                  open: true,
                  file_id: file.id,
                  auth_id: auth.id
                }
              })}
              />
          </div>
        </div>
      );
    });
  }

  render() {
    const deleteDialogActions = [
      (
        <RaisedButton
          label="OK"
          primary={true} 
          onTouchTap={() => {
            this.setState({ deleteDialog: { open: false } });
            this.onDeleteClick(
              this.state.deleteDialog.file_id,
              this.state.deleteDialog.auth_id
            );
          }}
          />
      ),
      (
        <RaisedButton
          label="cancel"
          primary={false}
          onTouchTap={() => this.setState({ deleteDialog: { open: false } })}
          />
      )
    ];

    let addClickable = this.state.user.text !== "" && this.state.role.text !== "";

    return (
      <div>
        <div style={style.inputWrapper}>
          <AutoComplete
            style={style.autoComplete}
            hintText="ユーザ名またはグループ名を入力"
            searchText={this.state.user.text}
            floatingLabelText="ユーザ名またはグループ名を入力"
            onTouchTap={() => this.setState({ user: { text: "" } }) }
            onNewRequest={(text) => this.setState({ user: text })}
            filter={(text, key) => key.indexOf(text) !== -1 }
            openOnFocus={true}
            dataSource={this.users} />

          <AutoComplete
            style={style.autoComplete}
            hintText="ロールを入力"
            searchText={this.state.role.text}
            floatingLabelText="ロールを入力"
            onTouchTap={() => this.setState({ role: { text: "" } })}
            onNewRequest={(text) => this.setState({ role: text }) }
            filter={(text, key) => key.indexOf(text) !== -1 }
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
