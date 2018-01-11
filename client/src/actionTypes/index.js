// ファイル一覧
export const REQUEST_FETCH_FILES = "REQUEST_FETCH_FILES";
export const REQUEST_FETCH_NEXT_FILES = "REQUEST_FETCH_NEXT_FILES";
export const INIT_FILES = "INIT_FILES";
export const INIT_NEXT_FILES = "INIT_NEXT_FILES";
export const TOGGLE_FILE_CHECK = "TOGGLE_FILE_CHECK";
export const TOGGLE_FILE_CHECK_ALL = "TOGGLE_FILE_CHECK_ALL";
export const FILE_NEXT_PAGE = "FILE_NEXT_PAGE";
export const INIT_FILE_PAGINATION = "INIT_FILE_PAGINATION";
export const SET_PAGE_Y_OFFSET = "SET_PAGE_Y_OFFSET";
export const CLEAR_FILES = "CLEAR_FILES";

// ファイル詳細
export const REQUEST_FETCH_FILE = "REQUEST_FETCH_FILE";
export const INIT_FILE = "INIT_FILE";
export const UPDATE_FILE_ROW = "UPDATE_FILE_ROW";
export const INSERT_FILE_ROW = "INSERT_FILE_ROW";
export const DELETE_FILE_ROWS = "DELETE_FILE_ROWS";
export const REQUEST_FETCH_FILE_PREVIEW = "REQUEST_FETCH_FILE_PREVIEW";
export const INIT_FILE_PREVIEW = "INIT_FILE_PREVIEW";
export const TOGGLE_LOADING_FILE_PREVIEW = "TOGGLE_LOADING_FILE_PREVIEW";
export const INIT_FILE_PREVIEW_BODY = "INIT_FILE_PREVIEW_BODY";
export const FILE_PREVIEW_ERROR = "FILE_PREVIEW_ERROR";

// ファイル作成
export const TOGGLE_ADD_FILE = "TOGGLE_ADD_FILE";
export const FILE_UPLOAD = "FILE_UPLOAD";
export const UPLOAD_FILES = "UPLOAD_FILES";

// 簡易アップローダ
export const PUSH_FILE_TO_BUFFER = "PUSH_FILE_TO_BUFFER";
export const CLEAR_FILES_BUFFER = "CLEAR_FILES_BUFFER";
export const DELETE_FILE_BUFFER = "DELETE_FILE_BUFFER";
export const POP_FILE_TO_BUFFER = "POP_FILE_TO_BUFFER";
export const PUT_BINARY_FILE = "PUT_BINARY_FILE";

// ファイルダウンロード
export const DOWNLOAD_FILE = "DOWNLOAD_FILE";
export const DOWNLOAD_FILES = "DOWNLOAD_FILES";

// ファイル検索
export const SEARCH_FILE_SIMPLE = "SEARCH_FILE_SIMPLE";
export const FETCH_SEARCH_FILE_SIMPLE = "FETCH_SEARCH_FILE_SIMPLE";
export const KEEP_FILE_SIMPLE_SEARCH_VALUE = "KEEP_FILE_SIMPLE_SEARCH_VALUE";
export const GET_FILE_SIMPLE_SEARCH_VALUE = "GET_FILE_SIMPLE_SEARCH_VALUE";

// ファイル移動
export const MOVE_FILE = "MOVE_FILE";
export const MOVE_FILES = "MOVE_FILES";
export const TOGGLE_MOVE_FILES_DIALOG = "TOGGLE_MOVE_FILES_DIALOG";
export const TOGGLE_MOVE_FILE_DIALOG = "TOGGLE_MOVE_FILE_DIALOG";

// ファイル削除
export const DELETE_FILE = "DELETE_FILE";
export const TOGGLE_DELETE_FILE_DIALOG = "TOGGLE_DELETE_FILE_DIALOG";
export const DELETE_FILES = "DELETE_FILES";
export const TOGGLE_DELETE_FILES_DIALOG = "TOGGLE_DELETE_FILES_DIALOG";
export const TOGGLE_DOWNLOAD_FILES_DIALOG = "TOGGLE_DOWNLOAD_FILES_DIALOG";
export const TOGGLE_RESTORE_FILE_DIALOG = "TOGGLE_RESTORE_FILE_DIALOG";
export const RESTORE_FILE = "RESTORE_FILE";

// ファイルソート
export const SET_SORT_TARGET = "SET_SORT_TARGET";
export const TOGGLE_SORT_TARGET = "TOGGLE_SORT_TARGET";
export const SORT_FILE = "SORT_FILE";

// ファイルコピー
export const COPY_FILE = "COPY_FILE";
export const TOGGLE_COPY_FILE_DIALOG = "TOGGLE_COPY_FILE_DIALOG";

// ファイルの権限変更
export const TOGGLE_AUTHORITY_FILE_DIALOG = "TOGGLE_AUTHORITY_FILE_DIALOG";
export const INIT_AUTHORITY_FILE_DIALOG = "INIT_AUTHORITY_FILE_DIALOG";
export const ADD_AUTHORITY_TO_FILE = "ADD_AUTHORITY_TO_FILE";
export const DELETE_AUTHORITY_TO_FILE = "DELETE_AUTHORITY_TO_FILE";

// ファイルの履歴
export const TOGGLE_HISTORY_FILE_DIALOG = "TOGGLE_HISTORY_FILE_DIALOG";

// ファイルのタグ
export const TOGGLE_FILE_TAG_DIALOG = "TOGGLE_FILE_TAG_DIALOG";
export const INIT_FILE_TAG = "INIT_FILE_TAG";

// ファイルのメタ情報
export const TOGGLE_FILE_META_INFO_DIALOG = "TOGGLE_FILE_META_INFO_DIALOG";
export const INIT_FILE_META_INFO = "INIT_FILE_META_INFO";

// お気に入りファイル
export const TOGGLE_STAR = "TOGGLE_STAR";
export const TOGGLE_STAR_SUCCESSFUL = "TOGGLE_STAR_SUCCESSFUL"; // お気に入り切替の後続処理

// ファイル名変更
export const TOGGLE_CHANGE_FILE_NAME_DIALOG = "TOGGLE_CHANGE_FILE_NAME_DIALOG";
export const CHANGE_FILE_NAME = "CHANGE_FILE_NAME";
export const CHANGE_FILE_NAME_ERROR = "CHANGE_FILE_NAME_ERROR";

// お知らせ
export const TOGGLE_NOTIFICATIONS = "TOGGLE_NOTIFICATIONS";

// フォルダツリー
export const DELETE_DIR_TREE = "DELETE_DIR_TREE";
export const SELECT_DIR_TREE = "SELECT_DIR_TREE";
export const REQUEST_FETCH_DIR_TREE = "REQUEST_FETCH_DIR_TREE";
export const LOADING_FETCH_DIR_TREE = "LOADING_FETCH_DIR_TREE";
export const PUT_DIR_TREE = "PUT_DIR_TREE";

// フォルダ作成
export const TOGGLE_ADD_DIR = "TOGGLE_ADD_DIR";
export const CREATE_DIR = "CREATE_DIR";
export const INIT_DIR = "INIT_DIR";
export const TOGGLE_CREATE_DIR = "TOGGLE_CREATE_DIR";
export const CREATE_DIR_ERROR = "CREATE_DIR_ERROR";

// フォルダ移動
export const MOVE_DIR = "MOVE_DIR";
export const TOGGLE_MOVE_DIR_DIALOG = "TOGGLE_MOVE_DIR_DIALOG";

// フォルダ削除
export const TOGGLE_DELETE_DIR_DIALOG = "TOGGLE_DELETE_DIR_DIALOG";
export const DELETE_DIR = "DELETE_DIR";

// フォルダコピー
export const TOGGLE_COPY_DIR_DIALOG = "TOGGLE_COPY_DIR_DIALOG";

// フォルダ編集
export const TOGGLE_AUTHORITY_DIR_DIALOG = "TOGGLE_AUTHORITY_DIR_DIALOG";

// タグ一覧
export const REQUEST_FETCH_TAGS = "REQUEST_FETCH_TAGS";
export const INIT_TAGS = "INIT_TAGS";
export const SEARCH_TAG_SIMPLE = "SEARCH_TAG_SIMPLE";

// タグ詳細
export const INIT_TAG = "INIT_TAG";
export const REQUEST_FETCH_TAG = "REQUEST_FETCH_TAG";

// タグ作成
export const ADD_TAG = "ADD_TAG";
export const REQUEST_ADD_TAG = "REQUEST_ADD_TAG";
export const CREATE_TAG = "CREATE_TAG";

// タグ変更
export const CHANGE_TAG_LABEL = "CHANGE_TAG_LABEL";
export const CHANGE_TAG_COLOR = "CHANGE_TAG_COLOR";
export const SAVE_TAG_LABEL = "SAVE_TAG_LABEL";
export const SAVE_TAG_COLOR = "SAVE_TAG_COLOR";
export const SAVE_TAG_VALIDATION_ERROR = "SAVE_TAG_VALIDATION_ERROR";
export const TOGGLE_COLOR_PICKER = "TOGGLE_COLOR_PICKER";

// タグ削除
export const REQUEST_DEL_TAG = "REQUEST_DEL_TAG";
export const DELETE_TAG = "DELETE_TAG";

// メタ情報
export const ADD_META_INFO_TO_FILE = "ADD_META_INFO_TO_FILE";
export const DELETE_META_INFO_TO_FILE = "DELETE_META_INFO_TO_FILE";
export const REQUEST_FETCH_META_INFOS = "REQUEST_FETCH_META_INFOS";
export const REQUEST_FETCH_META_INFO = "REQUEST_FETCH_META_INFO";
export const INIT_META_INFOS = "INIT_META_INFOS";
export const INIT_META_INFO = "INIT_META_INFO";
export const INIT_CHANGED_META_INFO = "INIT_CHANGED_META_INFO";
export const TOGGLE_META_INFO_DIALOG = "TOGGLE_META_INFO_DIALOG";
export const UPDATE_META_INFO_TARGET = "UPDATE_META_INFO_TARGET";
export const CHANGE_META_INFO_LABEL = "CHANGE_META_INFO_LABEL";
export const CHANGE_META_INFO_NAME = "CHANGE_META_INFO_NAME";
export const CHANGE_META_INFO_VALUE_TYPE = "CHANGE_META_INFO_VALUE_TYPE";
export const CREATE_META_INFO = "CREATE_META_INFO";
export const SAVE_META_INFO_VALIDATION_ERRORS = "SAVE_META_INFO_VALIDATION_ERRORS";
export const CLEAR_META_INFO_VALIDATION_ERRORS = "CLEAR_META_INFO_VALIDATION_ERRORS";
export const SAVE_METAINFO_LABEL = "SAVE_METAINFO_LABEL";
export const SAVE_METAINFO_NAME = "SAVE_METAINFO_NAME";
// ログイン
export const REQUEST_LOGIN = "REQUEST_LOGIN";
export const REQUEST_LOGIN_SUCCESS = "REQUEST_LOGIN_SUCCESS";
export const REQUEST_LOGIN_FAILED = "REQUEST_LOGIN_FAILED";
export const REQUEST_VERIFY_TOKEN = "REQUEST_VERIFY_TOKEN";

// ログアウト
export const LOGOUT = "LOGOUT";

// パスワード変更
export const REQUEST_CHANGE_PASSWORD = "REQUEST_CHANGE_PASSWORD";
export const TOGGLE_CHANGE_PASSWORD_DIALOG = "TOGGLE_CHANGE_PASSWORD_DIALOG";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_FAILED = "CHANGE_PASSWORD_FAILED";

// loadingのオーバレイ
export const LOADING_START = "LOADING_START";
export const LOADING_END = "LOADING_END";

// テナント
export const PUT_TENANT = "PUT_TENANT";

// ユーザ一覧
export const REQUEST_FETCH_USERS = "REQUEST_FETCH_USERS";
export const INIT_USERS = "INIT_USERS";

// ユーザ検索
export const SEARCH_USERS = "SEARCH_USERS";

// ユーザ詳細
export const REQUEST_FETCH_USER = "REQUEST_FETCH_USER";
export const INIT_USER = "INIT_USER";

// ユーザ作成
export const INIT_NEW_USER_TEMPLATE = "INIT_NEW_USER_TEMPLATE";
export const CREATE_USER = "CREATE_USER";

// ユーザ変更
export const TOGGLE_USER = "TOGGLE_USER";
export const CHANGE_USER_NAME = "CHANGE_USER_NAME";
export const CHANGE_USER_ACCOUNT_NAME = "CHANGE_USER_ACCOUNT_NAME";
export const CHANGE_USER_VALIDATION_ERROR = "CHANGE_USER_VALIDATION_ERROR";
export const CLEAR_USER_VALIDATION_ERROR = "CLEAR_USER_VALIDATION_ERROR";
export const CHANGE_USER_PASSWORD = "CHANGE_USER_PASSWORD";
export const SAVE_USER_NAME = "SAVE_USER_NAME";
export const SAVE_USER_ACCOUNT_NAME = "SAVE_USER_ACCOUNT_NAME";
export const SAVE_USER_EMAIL = "SAVE_USER_EMAIL";
export const SAVE_USER_PASSWORD = "SAVE_USER_PASSWORD";
export const SAVE_USER_PASSWORD_FORCE = "SAVE_USER_PASSWORD_FORCE";
export const CHANGE_USER_EMAIL = "CHANGE_USER_EMAIL";
export const SAVE_USER_ROLE_ID = "SAVE_USER_ROLE_ID";
export const CHANGE_USER_ROLE_ID = "CHANGE_USER_ROLE_ID";

// 所属グループ変更
export const DELETE_GROUP_OF_USER = "DELETE_GROUP_OF_USER";
export const ADD_GROUP_OF_USER = "ADD_GROUP_OF_USER";

// グループ一覧
export const INIT_GROUPS = "INIT_GROUPS";
export const SEARCH_GROUP_SIMPLE = "SEARCH_GROUP_SIMPLE";

// グループ詳細
export const REQUEST_FETCH_GROUP = "REQUEST_FETCH_GROUP";

// グループ検索
export const REQUEST_FETCH_GROUPS = "REQUEST_FETCH_GROUPS";

// グループ詳細
export const INIT_GROUP = "INIT_GROUP";

// グループ作成
export const CREATE_GROUP = "CREATE_GROUP";
export const INIT_CREATE_GROUP = "INIT_CREATE_GROUP";

// グループ変更
export const CHANGE_GROUP_NAME = "CHANGE_GROUP_NAME";
export const CHANGE_GROUP_DESCRIPTION = "CHANGE_GROUP_DESCRIPTION";
export const SAVE_GROUP_NAME = "SAVE_GROUP_NAME";
export const SAVE_GROUP_DESCRIPTION = "SAVE_GROUP_DESCRIPTION";
export const SAVE_GROUP_VALIDATION_ERROR = "SAVE_GROUP_VALIDATION_ERROR";
export const CLEAR_GROUP_VALIDATION_ERROR = "CLEAR_GROUP_VALIDATION_ERROR";
export const CLEAR_CHANGE_GROUP_DATA = "CLEAR_CHANGE_GROUP_DATA";

// グループ削除
export const DELETE_GROUP = "DELETE_GROUP";

// ロール一覧
export const REQUEST_FETCH_ROLES = "REQUEST_FETCH_ROLES";
export const INIT_ROLES = "INIT_ROLES";

// ロール詳細
export const INIT_ROLE = "INIT_ROLE";
export const REQUEST_FETCH_ROLE = "REQUEST_FETCH_ROLE";

// ロール作成
export const CREATE_ROLE = "CREATE_ROLE";
export const INIT_CREATE_ROLE = "INIT_CREATE_ROLE";

// ロール変更
export const CHANGE_ROLE_NAME = "CHANGE_ROLE_NAME";
export const CHANGE_ROLE_DESCRIPTION = "CHANGE_ROLE_DESCRIPTION";
export const SAVE_ROLE_NAME = "SAVE_ROLE_NAME";
export const SAVE_ROLE_DESCRIPTION = "SAVE_ROLE_DESCRIPTION";
export const SAVE_ROLE_VALIDATION_ERROR = "SAVE_ROLE_VALIDATION_ERROR";
export const CLEAR_ROLE_VALIDATION_ERROR = "CLEAR_ROLE_VALIDATION_ERROR";
export const DELETE_ROLE_OF_ACTION = "DELETE_ROLE_OF_ACTION";
export const ADD_ROLE_OF_ACTION = "ADD_ROLE_OF_ACTION";

// ロール削除
export const DELETE_ROLE = "DELETE_ROLE";

// アクション一覧
export const REQUEST_FETCH_ACTIONS = "REQUEST_FETCH_ACTIONS";
export const INIT_ACTIONS = "INIT_ACTIONS";

// ファイルの検索項目
export const REQUEST_FETCH_FILE_SEARCH_ITEMS = "REQUEST_FETCH_FILE_SEARCH_ITEMS";
export const INIT_FILE_DETAIL_SEARCH_ITEMS = "INIT_FILE_DETAIL_SEARCH_ITEMS";
export const TOGGLE_FILE_DETAIL_SEARCH_POPOVER = "TOGGLE_FILE_DETAIL_SEARCH_POPOVER";
export const FILE_DETAIL_SEARCH_ANCHOR_ELEMENT = "FILE_DETAIL_SEARCH_ANCHOR_ELEMENT";
export const SEARCH_ITEM_PICK = "SEARCH_ITEM_PICK";
export const SEARCH_ITEM_NOT_PICK = "SEARCH_ITEM_NOT_PICK";
export const SEARCH_ITEM_NOT_PICK_ALL = "SEARCH_ITEM_NOT_PICK_ALL";
export const SEARCH_VALUE_CHANGE = "SEARCH_VALUE_CHANGE";
export const SEARCH_FILE_DETAIL = "SEARCH_FILE_DETAIL";
export const FETCH_SEARCH_FILE_DETAIL = "FETCH_SEARCH_FILE_DETAIL";

// 容量管理
export const REQUEST_FETCH_ANALYSIS = "REQUEST_FETCH_ANALYSIS";
export const REQUEST_FETCH_ANALYSIS_PERIOD = "REQUEST_FETCH_ANALYSIS_PERIOD";
export const INIT_ANALYSIS = "INIT_ANALYSIS";
export const INIT_FILE_TOTAL = "INIT_FILE_TOTAL";
export const INIT_ANALYSIS_PERIOD = "INIT_ANALYSIS_PERIOD";

// snackbar
export const TRIGGER_SNACK = "TRIGGER_SNACK";
export const CLOSE_SNACK = "CLOSE_SNACK";
export const INIT_SNACK = "INIT_SNACK";

// エラー表示
export const OPEN_EXCEPTION = "OPEN_EXCEPTION";
export const CLOSE_EXCEPTION = "CLOSE_EXCEPTION";
export const INIT_EXCEPTION = "INIT_EXCEPTION";

// メニュー管理一覧
export const REQUEST_FETCH_ROLE_MENUS = "REQUEST_FETCH_ROLE_MENUS";
export const INIT_ROLE_MENUS = "INIT_ROLE_MENUS";

// メニュー管理詳細
export const REQUEST_FETCH_ROLE_MENU = "REQUEST_FETCH_ROLE_MENU";
export const INIT_ROLE_MENU = "INIT_ROLE_MENU";

// メニュー管理変更
export const CHANGE_ROLE_MENU_NAME = "CHANGE_ROLE_MENU_NAME";
export const SAVE_ROLE_MENU_NAME = "SAVE_ROLE_MENU_NAME";
export const CHANGE_ROLE_MENU_DESCRIPTION = "CHANGE_ROLE_MENU_DESCRIPTION";
export const SAVE_ROLE_MENU_DESCRIPTION = "SAVE_ROLE_MENU_DESCRIPTION";
export const CLEAR_ROLE_MENU_VALIDATION_ERROR = "CLEAR_ROLE_MENU_VALIDATION_ERROR";
export const SAVE_ROLE_MENU_VALIDATION_ERROR = "SAVE_ROLE_MENU_VALIDATION_ERROR";
export const ADD_ROLE_OF_MENU = "ADD_ROLE_OF_MENU";
export const DELETE_ROLE_OF_MENU = "DELETE_ROLE_OF_MENU";
export const CREATE_ROLE_MENU = "CREATE_ROLE_MENU";
export const INIT_CREATE_ROLE_MENU = "INIT_CREATE_ROLE_MENU";
export const DELETE_ROLE_MENU = "DELETE_ROLE_MENU";

// メニュー一覧
export const REQUEST_FETCH_MENUS = "REQUEST_FETCH_MENUS";
export const INIT_MENUS = "INIT_MENUS";

// ユーザのメニュー一覧
export const REQUEST_FETCH_AUTHORITY_MENUS = "REQUEST_FETCH_AUTHORITY_MENUS";
export const INIT_AUTHORITY_MENU = "INIT_AUTHORITY_MENU";

// 表示項目一覧
export const REQUEST_FETCH_DISPLAY_ITEMS = "REQUEST_FETCH_DISPLAY_ITEMS";
export const INIT_DISPLAY_ITEMS = "INIT_DISPLAY_ITEMS";

// お知らせ一覧
export const REQUEST_FETCH_NOTIFICATION = "REQUEST_FETCH_NOTIFICATION";
export const INIT_NOTIFICAITON = "INIT_NOTIFICAITON";
export const REQUEST_FETCH_MORE_NOTIFICATION = "REQUEST_FETCH_MORE_NOTIFICATION";
export const INIT_MORE_NOTIFICAITON = "INIT_MORE_NOTIFICAITON";
export const OPEN_NOTIFICATIONS = "OPEN_NOTIFICATIONS";
export const CLOSE_NOTIFICATIONS = "CLOSE_NOTIFICATIONS";

// お知らせ既読
export const REQUEST_UPDATE_NOTIFICATIONS_READ = "REQUEST_UPDATE_NOTIFICATIONS_READ";

// reduxのデバッグ用(空のイベントをdispatchするだけでredux-loggerがフックされるので)
export const DEBUG_REDUX_LOGGER = "DEBUG_REDUX_LOGGER";

// 一覧ダウンロード
export const DOWNLOAD_XLSX_FILE = "DOWNLOAD_XLSX_FILE";
export const DOWNLOAD_XLSX_FILE_SIMPLE = "DOWNLOAD_XLSX_FILE_SIMPLE";
export const DOWNLOAD_XLSX_FILE_DETAIL = "DOWNLOAD_XLSX_FILE_DETAIL";

// 一覧の種類(一覧・簡易検索・詳細検索)
export const INIT_FILE_LIST_TYPE = "INIT_FILE_LIST_TYPE";
export const SET_FILE_LIST_TYPE = "SET_FILE_LIST_TYPE";