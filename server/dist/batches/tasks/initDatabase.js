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

var _ = _interopRequireWildcard(require("lodash"));

var _server = require("../../configs/server");

var _co = _interopRequireDefault(require("co"));

var _moment = _interopRequireDefault(require("moment"));

var _util = _interopRequireDefault(require("util"));

var _logger = _interopRequireDefault(require("../../logger"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _Dir = _interopRequireDefault(require("../../models/Dir"));

var _File = _interopRequireDefault(require("../../models/File"));

var _Group = _interopRequireDefault(require("../../models/Group"));

var _User = _interopRequireDefault(require("../../models/User"));

var _Action = _interopRequireDefault(require("../../models/Action"));

var _Menu = _interopRequireDefault(require("../../models/Menu"));

var _RoleFile = _interopRequireDefault(require("../../models/RoleFile"));

var _RoleMenu = _interopRequireDefault(require("../../models/RoleMenu"));

var _AuthorityMenu = _interopRequireDefault(require("../../models/AuthorityMenu"));

var _AuthorityFile = _interopRequireDefault(require("../../models/AuthorityFile"));

var _Preview = _interopRequireDefault(require("../../models/Preview"));

var _AppSetting = _interopRequireDefault(require("../../models/AppSetting"));

var _DownloadInfo = _interopRequireDefault(require("../../models/DownloadInfo"));

var _Tag = _interopRequireDefault(require("../../models/Tag"));

var _DisplayItem = _interopRequireDefault(require("../../models/DisplayItem"));

var _MetaInfo = _interopRequireDefault(require("../../models/MetaInfo"));

// logger
// models
var drop_collection = function drop_collection(collection_name) {
  return new Promise(function (resolve, reject) {
    _mongoose["default"].connection.db.dropCollection(collection_name, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

var connect = function connect(uri) {
  return new Promise(function (resolve, reject) {
    _mongoose["default"].connect(uri, {
      useNewUrlParser: true
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

var task =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var exists_list, target_collections, actions, menus, preview, meta_infos;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            //2019/05/16 このバッチは動作しない 
            console.log('initDatabase running...'); //await connect(`mongodb://54.64.22.157:17017/walter`)

            console.log('conected!'); // ===============================
            //  all collection drop
            // ===============================

            _context2.next = 5;
            return _mongoose["default"].connection.db.listCollections().toArray();

          case 5:
            _context2.t0 = function (item) {
              return item.name;
            };

            exists_list = _context2.sent.map(_context2.t0);
            target_collections = _.intersection(exists_list, ['files', 'dirs', 'tenants', 'groups', 'users', 'tags', 'meta_infos', 'display_items', 'actions', 'menus', 'role_files', 'role_menus', 'previews', 'authority_files', 'authority_menus', 'notifications', 'file_meta_infos', 'download_infos', 'app_settings']);
            _context2.t1 = Promise;
            _context2.next = 11;
            return _.map(target_collections,
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(col) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return drop_collection(col);

                      case 2:
                        return _context.abrupt("return", _context.sent);

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 11:
            _context2.t2 = _context2.sent;
            _context2.next = 14;
            return _context2.t1.all.call(_context2.t1, _context2.t2);

          case 14:
            // ===============================
            //  files collection
            // ===============================
            // ===============================
            //  dirs collection
            // ===============================
            // ===============================
            //  tenants collection
            // ===============================
            // ===============================
            // groups collection
            // ===============================
            // ===============================
            //  users collection
            // ===============================
            // ===============================
            //  tags collection
            // ===============================
            // ===============================
            //  meta_infos collection
            // ===============================
            // ===============================
            //  display_items collection
            // ===============================
            // ===============================
            //  actions collection
            // ===============================
            actions = [{
              name: "list",
              label: "一覧表示"
            }, {
              name: "detail",
              label: "詳細表示"
            }, {
              name: "history",
              label: "履歴情報表示"
            }, {
              name: "download",
              label: "ダウンロード"
            }, {
              name: "change-name",
              label: "ファイル名変更"
            }, {
              name: "change-tag",
              label: "タグ変更"
            }, {
              name: "change-meta-info",
              label: "メタ情報変更"
            }, {
              name: "upload",
              label: "アップロード"
            }, {
              name: "makedir",
              label: "フォルダ作成"
            }, {
              name: "move",
              label: "移動"
            }, {
              name: "copy",
              label: "複製"
            }, {
              name: "restore",
              label: "復元"
            }, {
              name: "delete",
              label: "削除"
            }, // {
            //   name: "revert",
            //   label: "ゴミ箱から元に戻す"
            // },
            {
              name: "authority",
              label: "権限変更"
            }, {
              name: "file-authority",
              label: "ファイル権限変更"
            }, {
              name: "dir-authority",
              label: "フォルダ権限変更"
            }];
            _context2.next = 17;
            return _Action["default"].insertMany(actions);

          case 17:
            // ===============================
            //  role_files collection
            // ===============================
            // ===============================
            //  menus collection
            // ===============================
            menus = [{
              name: "home",
              label: "ファイル一覧"
            }, {
              name: "tags",
              label: "タグ管理"
            }, {
              name: "analysis",
              label: "容量管理"
            }, {
              name: "users",
              label: "ユーザ管理"
            }, {
              name: "groups",
              label: "グループ管理"
            }, {
              name: "role_files",
              label: "ロール管理"
            }, {
              name: "role_menus",
              label: "ユーザタイプ管理"
            }, {
              name: "meta_infos",
              label: "メタ情報管理"
            }]; //db.menus.insert(menus);

            _context2.next = 20;
            return _Menu["default"].insertMany(menus);

          case 20:
            preview = {
              image: null
            }; //db.previews.insert(preview);

            _context2.next = 23;
            return _Preview["default"].insertMany(menus);

          case 23:
            // ===============================
            //  ダウンロードファイルの命名規則
            // ===============================
            // ===============================
            //  テナント毎のグローバル設定(app_settings)
            // ===============================
            // ===============================
            // addTenantにてDownloadInfoを作成するためのダミードキュメント。
            // いつか削除する
            //
            meta_infos = [{
              label: "送信日時",
              name: "send_date_time",
              value_type: "Date"
            }, {
              label: "表示ファイル名",
              name: "display_file_name",
              value_type: "String"
            }]; //db.meta_infos.insert(meta_infos);

            _context2.next = 26;
            return _MetaInfo["default"].insertMany(meta_infos);

          case 26:
            console.log('initDatabase completed.');
            _context2.next = 34;
            break;

          case 29:
            _context2.prev = 29;
            _context2.t3 = _context2["catch"](0);
            console.log(_context2.t3);
            console.log(_util["default"].inspect(_context2.t3, false, null));

            _logger["default"].error(_context2.t3); //process.exit();


          case 34:
            _context2.prev = 34;

            _logger["default"].info("################# init database end #################"); //process.exit();


            return _context2.finish(34);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 29, 34, 37]]);
  }));

  return function task() {
    return _ref.apply(this, arguments);
  };
}();

var _default = task;
exports["default"] = _default;