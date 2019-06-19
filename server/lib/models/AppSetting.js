import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AppSettingSchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  name: Schema.Types.String,
  description: Schema.Types.String,
  enable: Schema.Types.Boolean,
  default_value: Schema.Types.Mixed
});

const AppSetting = mongoose.model("app_settings", AppSettingSchema, "app_settings");

AppSetting.INHERIT_PARENT_DIR_AUTH = "inherit_parent_dir_auth"; //親フォルダの割り当てられたユーザファイル操作権限を継承する
AppSetting.SHOW_TRASH_ICON_BY_OWN_AUTH = "show_trash_icon_by_own_auth"; //ごみ箱アイコンの表示をTrashフォルダの権限に負う
AppSetting.TIMESTAMP_PERMISSION = "timestamp_permission"; //タイムスタンプサービスの利用を許可する
AppSetting.FULL_TEXT_SEARCH_ENABLED = "full_text_search_enabled"; //全文検索機能を使用するか

export default AppSetting;
