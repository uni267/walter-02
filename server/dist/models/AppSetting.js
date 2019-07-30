"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AppSettingSchema = (0, _mongoose.Schema)({
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: _mongoose.Schema.Types.String,
  description: _mongoose.Schema.Types.String,
  enable: _mongoose.Schema.Types.Boolean,
  default_value: _mongoose.Schema.Types.Mixed
});
/**
 * 設定をオブジェクト型の{設定名:true/false}として返却
 * usage:
 *  AppSetting.INHERIT_PARENT_DIR_AUTHの設定を取得する
 *    const inherit_parent_dir_auth_enabled = (await AppSetting.getSettings(tenant_id))[AppSetting.INHERIT_PARENT_DIR_AUTH]
 */

AppSettingSchema.statics.getSettings =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenant_id) {
    var appSettings;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return AppSetting.find({
              tenant_id: tenant_id
            });

          case 3:
            appSettings = _context.sent;
            return _context.abrupt("return", appSettings.reduce(function (result, current) {
              result[current.name] = current.enable === true ? true : false;
              return result;
            }, {}));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

var AppSetting = _mongoose["default"].model("app_settings", AppSettingSchema, "app_settings");

AppSetting.INHERIT_PARENT_DIR_AUTH = "inherit_parent_dir_auth"; //親フォルダの割り当てられたユーザファイル操作権限を継承する

AppSetting.SHOW_TRASH_ICON_BY_OWN_AUTH = "show_trash_icon_by_own_auth"; //ごみ箱アイコンの表示をTrashフォルダの権限に負う

AppSetting.TIMESTAMP_PERMISSION = "timestamp_permission"; //タイムスタンプサービスの利用を許可する

AppSetting.FULL_TEXT_SEARCH_ENABLED = "full_text_search_enabled"; //全文検索機能を使用するか

AppSetting.EXPORT_EXCEL_FOR_FILELIST = "export_excel_for_filelist"; //ファイル一覧のexcel出力を許可する。

AppSetting.NOTIFICATION_FROM_APP = "notification_from_app"; //アプリケーションからの通知を許可する。

AppSetting.HELP_ICON_ON_APP_BAR = "help_icon_on_app_bar"; //APPバーにマニュアルへのリンクを表示する。

var _default = AppSetting;
exports["default"] = _default;