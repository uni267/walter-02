// 最上位のフォルダ名
export const TOP_DIR_NAME = "Top";

// 権限(file)
export const PERMISSION_VIEW_LIST = "list";
export const PERMISSION_VIEW_DETAIL = "detail";
export const PERMISSION_VIEW_HISTORY = "history";
export const PERMISSION_DOWNLOAD = "download";
export const PERMISSION_CHANGE_NAME = "change-name";
export const PERMISSION_CHANGE_TAG = "change-tag";
export const PERMISSION_CHANGE_META_INFO = "change-meta-info";
export const PERMISSION_UPLOAD = "upload";
export const PERMISSION_MAKE_DIR = "makedir";
export const PERMISSION_MOVE = "move";
export const PERMISSION_COPY = "copy";
export const PERMISSION_RESTORE = "restore";
export const PERMISSION_DELETE = "delete";
//export const PERMISSION_REVERT = "revert";    未使用
export const PERMISSION_AUTHORITY = "authority";
export const PERMISSION_FILE_AUTHORITY = "file-authority";  //ファイル権限変更
export const PERMISSION_DIR_AUTHORITY = "dir-authority";    //フォルダ権限変更
export const PERMISSION_ADD_TIMESTAMP = "add-timestamp";
export const PERMISSION_VERIFY_TIMESTAMP = "verify-timestamp";
export const PERMISSION_AUTO_TIMESTAMP = "auto-timestamp";


export const ROLE_NAME_FULL_CONTROLL = "フルコントロール";    //フルコントロールroleのname

// 権限(menu)
export const PERMISSION_META_INFOS = "meta_infos";
export const PERMISSION_GROUPS = "groups";
export const PERMISSION_HOME = "home";
export const PERMISSION_FILES = "files";
export const PERMISSION_USERS = "users";
export const PERMISSION_TAGS = "tags";
export const PERMISSION_ROLE_FILES = "role_files";
export const PERMISSION_ROLE_MENUS = "role_menus";
export const PERMISSION_ANALYSIS = "analysis";

// 一覧の種類
export const LIST_DEFAULT = "LIST_DEFAULT";
export const LIST_SEARCH_SIMPLE = "LIST_SEARCH_SIMPLE";
export const LIST_SEARCH_DETAIL = "LIST_SEARCH_DETAIL";
// export const FILE_DETAIL = "FILE_DETAIL";

// apiのタイムアウト時間(ミリsec)
export const DEFAULT_API_TIMEOUT = 500 * 1000;
export const PREVIEW_API_TIMEOUT = 20 * 1000;

// AppSetting
const AppSetting = {}

AppSetting.UNVISIBLE_FILES_TOGGLE = "unvisible_files_toggle"; //非表示属性のファイルを表示/非表示するトグルを表示するか
AppSetting.CHANGE_USER_PASSWORD_PERMISSION = "change_user_password_permission"; //ユーザにパスワード変更の権限を許可するか
AppSetting.INHERIT_PARENT_DIR_AUTH = "inherit_parent_dir_auth"; //親フォルダの割り当てられたユーザファイル操作権限を継承する
AppSetting.SHOW_TRASH_ICON_BY_OWN_AUTH = "show_trash_icon_by_own_auth"; //ごみ箱アイコンの表示をTrashフォルダの権限に負う
AppSetting.TIMESTAMP_PERMISSION = "timestamp_permission"; //タイムスタンプサービスの利用を許可する
AppSetting.FULL_TEXT_SEARCH_ENABLED = "full_text_search_enabled"; //全文検索機能を使用するか
AppSetting.EXPORT_EXCEL_FOR_FILELIST = "export_excel_for_filelist"; //ファイル一覧のexcel出力を許可する。
AppSetting.NOTIFICATION_FROM_APP = "notification_from_app"; //アプリケーションからの通知を許可する。
AppSetting.HELP_ICON_ON_APP_BAR = "help_icon_on_app_bar"; //APPバーにマニュアルへのリンクを表示する。
export const APP_SETTING = AppSetting

