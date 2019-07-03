import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AppSettingSchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  name: Schema.Types.String,
  description: Schema.Types.String,
  enable: Schema.Types.Boolean,
  default_value: Schema.Types.Mixed
});

/**
 * 設定をオブジェクト型の{設定名:true/false}として返却
 * usage:
 *  AppSetting.INHERIT_PARENT_DIR_AUTHの設定を取得する
 *    const inherit_parent_dir_auth_enabled = (await AppSetting.getSettings(tenant_id))[AppSetting.INHERIT_PARENT_DIR_AUTH]
 */
AppSettingSchema.statics.getSettings = async tenant_id => { 
  try {
    const appSettings = await AppSetting.find({ tenant_id });    
    return appSettings.reduce((result, current) => {
      result[current.name] = current.enable === true ? true : false
      return result;
    }, {});
  } catch (error) {
    throw error;
  }
};

const AppSetting = mongoose.model("app_settings", AppSettingSchema, "app_settings");

AppSetting.INHERIT_PARENT_DIR_AUTH = "inherit_parent_dir_auth"; //親フォルダの割り当てられたユーザファイル操作権限を継承する
AppSetting.SHOW_TRASH_ICON_BY_OWN_AUTH = "show_trash_icon_by_own_auth"; //ごみ箱アイコンの表示をTrashフォルダの権限に負う
AppSetting.TIMESTAMP_PERMISSION = "timestamp_permission"; //タイムスタンプサービスの利用を許可する
AppSetting.FULL_TEXT_SEARCH_ENABLED = "full_text_search_enabled"; //全文検索機能を使用するか
AppSetting.EXPORT_EXCEL_FOR_FILELIST = "export_excel_for_filelist"; //ファイル一覧のexcel出力を許可する。
AppSetting.NOTIFICATION_FROM_APP = "notification_from_app"; //アプリケーションからの通知を許可する。
AppSetting.HELP_ICON_ON_APP_BAR = "help_icon_on_app_bar"; //APPバーにマニュアルへのリンクを表示する。

export default AppSetting;
