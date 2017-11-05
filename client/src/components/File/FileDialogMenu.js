import React from "react";

import * as constants from "../../constants";

// material-ui
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";

// icons
import ActionDelete from "material-ui/svg-icons/action/delete";
import ActionDescription from "material-ui/svg-icons/action/description";
import ActionFingerprint from "material-ui/svg-icons/action/fingerprint";
import ActionLabel from "material-ui/svg-icons/action/label";
import ActionHistory from "material-ui/svg-icons/action/history";
import ActionRestore from "material-ui/svg-icons/action/restore";
import ActionVerifiedUser from "material-ui/svg-icons/action/verified-user";
import ContentContentCopy from "material-ui/svg-icons/content/content-copy";
import ContentForward from "material-ui/svg-icons/content/forward";
import EditorModeEdit from "material-ui/svg-icons/editor/mode-edit";
import FileFileDownload from "material-ui/svg-icons/file/file-download";

const FileDialogMenu = ({
  file,
  hover,
  trashDirId
}) => {

  const opacity = hover ? 1 : 0.1;

  const action_menu_icon = (
    <IconButton style={{ opacity }}>
      <NavigationMenu />
    </IconButton>
  );

  let menuItems = [
    {
      name: constants.PERMISSION_DOWNLOAD,
      component: (
        <MenuItem
          primaryText="ダウンロード"
          leftIcon={<FileFileDownload />}
          onTouchTap={() => (this.props.actions.downloadFile(file) )}
          />
      )
    },
    {
      name: constants.PERMISSION_CHANGE_NAME,
      component: (
        <MenuItem
          primaryText="ファイル名変更"
          leftIcon={<EditorModeEdit />}
          onTouchTap={() => this.setState({ editFile: { open: true } })} />
      )
    },
    {
      name: constants.PERMISSION_MOVE,
      component: (
        <MenuItem
          primaryText="移動"
          leftIcon={<ContentForward />}
          onTouchTap={() => this.props.actions.toggleMoveFileDialog(file)} />
      )
    },
    {
      name: constants.PERMISSION_COPY,
      component: (
        <MenuItem
          onTouchTap={() => this.props.actions.toggleCopyFileDialog(file)}
          leftIcon={<ContentContentCopy />}
          primaryText="コピー" />
      )
    },
    {
      name: constants.PERMISSION_DELETE,
      component: (
        <MenuItem
          primaryText="削除"
          leftIcon={<ActionDelete />}
          onTouchTap={() => this.props.actions.toggleDeleteFileDialog(file)} />
      )
    },
    {
      name: constants.PERMISSION_AUTHORITY,
      component: (
        <MenuItem
          primaryText="権限を変更"
          leftIcon={<ActionVerifiedUser />}
          onTouchTap={() => this.props.actions.toggleAuthorityFileDialog(file)} />
      )
    },
    {
      name: constants.PERMISSION_CHANGE_TAG,
      component: (
        <MenuItem
          primaryText="タグを編集"
          leftIcon={<ActionLabel />}
          onTouchTap={() => this.props.actions.toggleFileTagDialog(file)} />
      )
    },
    {
      name: constants.PERMISSION_CHANGE_META_INFO,
      component: (
        <MenuItem
          primaryText="メタ情報を編集"
          leftIcon={<ActionDescription />}
          onTouchTap={() => this.props.actions.toggleFileMetaInfoDialog(file)} />
      )
    },
    {
      name: constants.PERMISSION_VIEW_HISTORY,
      component: (
        <MenuItem
          primaryText="履歴を閲覧"
          leftIcon={<ActionHistory />}
          onTouchTap={() => this.props.actions.toggleHistoryFileDialog(file)} />
      )
    },
    {
      name: "PERMISSION_TIMESTAMP",
      component: (
        <MenuItem
          primaryText="タイムスタンプ発行"
          leftIcon={<ActionFingerprint />} />
      )
    }
  ];

  menuItems = trashDirId === file.dir_id
    ? menuItems.concat(
      {
        name: constants.PERMISSION_RESTORE,
        component: (
          <MenuItem
            primaryText="ゴミ箱から戻す"
            leftIcon={<ActionRestore />}
            onTouchTap={() => this.props.actions.toggleRestoreFileDialog(file)} />
        )
      })
    : menuItems;

  return (
    <IconMenu
      iconButtonElement={action_menu_icon}
      anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

      {menuItems.map( menu => (
        file.actions.map( act => act.name ).includes(menu.name)
          ? menu.component
          : null
      ))}

    </IconMenu>
  );
};

export default FileDialogMenu;
