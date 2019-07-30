"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = _interopRequireDefault(require("util"));

var _elasticsearchclient = _interopRequireDefault(require("../../elasticsearchclient"));

var _logger = _interopRequireDefault(require("../../logger"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _Action = _interopRequireDefault(require("../../models/Action"));

var _AppSetting = _interopRequireDefault(require("../../models/AppSetting"));

var _MetaInfo = _interopRequireDefault(require("../../models/MetaInfo"));

var _DisplayItem = _interopRequireDefault(require("../../models/DisplayItem"));

// logger
// models
var task =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenantName, tsaUser, tsaPass) {
    var tenant, appSetting;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log('追加済のテナントに対し、タイムスタンプ機能を追加します。');
            console.log('-------- Start --------');

            if (tenantName) {
              _context.next = 5;
              break;
            }

            throw "引数にテナント名を指定する必要があります。";

          case 5:
            if (tsaUser) {
              _context.next = 7;
              break;
            }

            throw "サイバーリンクスTSA認証局のユーザIDを指定してください。";

          case 7:
            if (tsaPass) {
              _context.next = 9;
              break;
            }

            throw "サイバーリンクスTSA認証局のユーザPWを指定してください。";

          case 9:
            _context.next = 11;
            return _Tenant["default"].findOne({
              name: tenantName
            });

          case 11:
            tenant = _context.sent;

            if (tenant) {
              _context.next = 14;
              break;
            }

            throw "存在しないテナントです。";

          case 14:
            //const tsaUser = process.argv[4]
            //const tsaPass = process.argv[5]
            console.log("\u30C6\u30CA\u30F3\u30C8 ".concat(tenant.name, "(").concat(tenant._id, ") \u306E\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u307E\u3059\u3002\u3002\u3002")); // const mapping = await esClient.indices.getMapping({ index: [tenant._id], include_type_name: true })
            // const props = mapping.body[tenant._id.toString()].mappings.files.properties.file.properties
            // const newFileProps = {
            //   properties: {
            //     file: {
            //       properties: {
            //         ...props,
            //         tstStatus: { "type": "keyword" },
            //         tstExpirationDate: { "type": "date" },
            //       }
            //     }
            //   }
            // }
            // await esClient.indices.putMapping({index: [tenant._id], type: "files", body:JSON.stringify(newFileProps), include_type_name: true});
            // タイムスタンプ関連のアクションを追加（全テナント共有）

            _context.next = 17;
            return _AppSetting["default"].findOne({
              tenant_id: tenant._id,
              name: _AppSetting["default"].TIMESTAMP_PERMISSION
            });

          case 17:
            appSetting = _context.sent;

            if (appSetting) {
              _context.next = 23;
              break;
            }

            _context.next = 21;
            return _AppSetting["default"].create({
              tenant_id: tenant._id,
              name: _AppSetting["default"].TIMESTAMP_PERMISSION,
              description: 'タイムスタンプサービスの利用を許可する。',
              enable: true
            });

          case 21:
            _context.next = 25;
            break;

          case 23:
            _context.next = 25;
            return appSetting.updateOne({
              $set: {
                enable: true
              }
            });

          case 25:
            _context.next = 27;
            return tenant.updateOne({
              $set: {
                tsaAuth: {
                  user: tsaUser,
                  pass: tsaPass
                }
              }
            });

          case 27:
            _context.next = 29;
            return _Action["default"].findOne({
              name: "add-timestamp"
            });

          case 29:
            if (_context.sent) {
              _context.next = 32;
              break;
            }

            _context.next = 32;
            return _Action["default"].insertMany([{
              "name": "add-timestamp",
              "label": "タイムスタンプ発行"
            }]);

          case 32:
            _context.next = 34;
            return _Action["default"].findOne({
              name: "verify-timestamp"
            });

          case 34:
            if (_context.sent) {
              _context.next = 37;
              break;
            }

            _context.next = 37;
            return _Action["default"].insertMany([{
              "name": "verify-timestamp",
              "label": "タイムスタンプ検証"
            }]);

          case 37:
            _context.next = 39;
            return _Action["default"].findOne({
              name: "auto-timestamp"
            });

          case 39:
            if (_context.sent) {
              _context.next = 42;
              break;
            }

            _context.next = 42;
            return _Action["default"].insertMany([{
              "name": "auto-timestamp",
              "label": "タイムスタンプ自動発行"
            }]);

          case 42:
            _context.next = 44;
            return _Action["default"].findOne({
              name: "auto-timestamp"
            });

          case 44:
            if (_context.sent) {
              _context.next = 47;
              break;
            }

            _context.next = 47;
            return _Action["default"].insertMany([{
              "name": "auto-timestamp",
              "label": "タイムスタンプ自動発行"
            }]);

          case 47:
            _context.next = 49;
            return _MetaInfo["default"].findOne({
              name: "timestamp"
            });

          case 49:
            if (_context.sent) {
              _context.next = 52;
              break;
            }

            _context.next = 52;
            return _MetaInfo["default"].insertMany([{
              "name": "timestamp",
              "label": "タイムスタンプ",
              "value_type": "Array"
            }]);

          case 52:
            _context.next = 54;
            return _MetaInfo["default"].findOne({
              name: "auto_grant_timestamp"
            });

          case 54:
            if (_context.sent) {
              _context.next = 57;
              break;
            }

            _context.next = 57;
            return _MetaInfo["default"].insertMany([{
              "name": "auto_grant_timestamp",
              "label": "自動タイムスタンプ",
              "value_type": "Boolean"
            }]);

          case 57:
            _context.next = 59;
            return _DisplayItem["default"].findOne({
              tenant_id: tenant._id,
              name: "timestamp"
            });

          case 59:
            if (_context.sent) {
              _context.next = 62;
              break;
            }

            _context.next = 62;
            return _DisplayItem["default"].create({
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "タイムスタンプ",
              name: "timestamp",
              search_value_type: "Select",
              is_display: false,
              is_excel: false,
              is_search: true,
              order: 150,
              value_type: "Select",
              select_options: [{
                name: "valid_timestamp",
                label: "有効なタイムスタンプ"
              }, {
                name: "expire_soon",
                label: "まもなく期限切れ"
              }, {
                name: "invalid_timestamp",
                label: "無効なタイムスタンプ"
              }]
            });

          case 62:
            _context.next = 69;
            break;

          case 64:
            _context.prev = 64;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            console.log(_util["default"].inspect(_context.t0, false, null));

            _logger["default"].error(_context.t0); //process.exit();


          case 69:
            _context.prev = 69;
            console.log('-------- Finish --------');

            _logger["default"].info("################# add timestamp setting end #################"); //process.exit();


            return _context.finish(69);

          case 73:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 64, 69, 73]]);
  }));

  return function task(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = task;
exports["default"] = _default;