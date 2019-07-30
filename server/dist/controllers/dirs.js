"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.getDescendants = exports.moveDir = exports.move = exports.create = exports.tree = exports.index = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _util = _interopRequireDefault(require("util"));

var _co = _interopRequireDefault(require("co"));

var _moment = _interopRequireDefault(require("moment"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _logger = _interopRequireDefault(require("../logger"));

var _elasticsearchclient = _interopRequireDefault(require("../elasticsearchclient"));

var _server = require("../configs/server");

var _Dir = _interopRequireDefault(require("../models/Dir"));

var _File = _interopRequireDefault(require("../models/File"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _User = _interopRequireDefault(require("../models/User"));

var _RoleFile = _interopRequireDefault(require("../models/RoleFile"));

var _AuthorityFile = _interopRequireDefault(require("../models/AuthorityFile"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _files = require("./files");

var _lodash = require("lodash");

var _AppError = require("../errors/AppError");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ObjectId = _mongoose["default"].Types.ObjectId;

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var dir_id, dirs, files, sorted, withSep, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dir_id = req.query.dir_id; // デフォルトはテナントのホーム

            if (dir_id === undefined || dir_id === null || dir_id === "") {
              dir_id = res.user.tenant.home_dir_id;
            }

            if (ObjectId.isValid(dir_id)) {
              _context.next = 5;
              break;
            }

            throw "dir_id is invalid";

          case 5:
            _context.next = 7;
            return _Dir["default"].find({
              descendant: dir_id
            }).sort({
              depth: -1
            });

          case 7:
            dirs = _context.sent;
            _context.next = 10;
            return _File["default"].find({
              _id: dirs.map(function (dir) {
                return dir.ancestor;
              })
            }).select({
              name: 1
            });

          case 10:
            files = _context.sent;
            sorted = dirs.map(function (dir) {
              return files.filter(function (file) {
                return file._id.toString() === dir.ancestor.toString();
              });
            }).reduce(function (a, b) {
              return a.concat(b);
            });
            withSep = [].concat.apply([], sorted.map(function (dir, idx) {
              return idx === 0 ? dir : ["sep", dir];
            }));
            res.json({
              status: {
                success: true
              },
              body: withSep
            });
            _context.next = 29;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "dir_id is invalid" ? 22 : _context.t1 === "dir_id is empty" ? 24 : 26;
            break;

          case 22:
            errors.dir_id = "指定されたフォルダが存在しないためフォルダ階層の取得に失敗しました";
            return _context.abrupt("break", 28);

          case 24:
            errors.dir_id = "フォルダIDが不正のためフォルダ階層の取得に失敗しました";
            return _context.abrupt("break", 28);

          case 26:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 28);

          case 28:
            res.status(400).json({
              status: {
                success: false,
                status: false,
                message: "フォルダ階層の取得に失敗しました",
                errors: errors
              }
            });

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));
};

exports.index = index;

var tree =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var root_id, root, dirs, children, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            root_id = req.query.root_id;

            if (!(root_id === undefined || root_id === null || root_id === "")) {
              _context3.next = 4;
              break;
            }

            throw "root_id is empty";

          case 4:
            if (ObjectId.isValid(root_id)) {
              _context3.next = 6;
              break;
            }

            throw "root_id is invalid";

          case 6:
            _context3.next = 8;
            return _File["default"].findById(root_id);

          case 8:
            root = _context3.sent;

            if (!(root === null)) {
              _context3.next = 11;
              break;
            }

            throw "root is empty";

          case 11:
            _context3.next = 13;
            return _Dir["default"].aggregate([{
              $match: {
                ancestor: root._id,
                depth: 1 //descendant: { $in: permittionIds }

              }
            }, {
              $lookup: {
                from: "files",
                localField: "descendant",
                foreignField: "_id",
                as: "descendant"
              }
            }, {
              $unwind: "$descendant"
            }, {
              $match: {
                // inゴミ箱、削除のフォルダは対象外
                $nor: [{
                  "descendant.dir_id": res.user.tenant.trash_dir_id
                }, {
                  "descendant.is_deleted": true
                }]
              }
              /* to future dir glood
              ,{ $lookup:
                {
                  from: "authority_files",
                  localField: "descendant._id",
                  foreignField: "files",
                  as: "auth"
                }
              },
              {
                  $match: {
                    $or : [
                      { "auth.users": mongoose.Types.ObjectId(res.user._id) },
                      { "auth.groups": {$in: user.groups } }],
                    "auth.role_files": {$in: role }
                  }
              }
              */

            }]);

          case 13:
            dirs = _context3.sent;

            if (!(dirs.length === 0)) {
              _context3.next = 18;
              break;
            }

            res.json({
              status: {
                success: true
              },
              body: {
                _id: root._id,
                name: root.name,
                children: []
              }
            });
            _context3.next = 23;
            break;

          case 18:
            _context3.next = 20;
            return Promise.all(dirs.map(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee2(dir) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = dir.descendant.is_display;

                        if (!_context2.t0) {
                          _context2.next = 5;
                          break;
                        }

                        _context2.next = 4;
                        return (0, _files.isAllowedFileId)(dir.descendant._id, res.user._id, constants.PERMISSION_VIEW_LIST);

                      case 4:
                        _context2.t0 = _context2.sent;

                      case 5:
                        if (!_context2.t0) {
                          _context2.next = 9;
                          break;
                        }

                        return _context2.abrupt("return", {
                          _id: dir.descendant._id,
                          name: dir.descendant.name
                        });

                      case 9:
                        return _context2.abrupt("return", null);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 20:
            _context3.t0 = function (child) {
              return child !== null;
            };

            children = _context3.sent.filter(_context3.t0);
            res.json({
              status: {
                success: true
              },
              body: {
                _id: root._id,
                name: root.name,
                children: children
              }
            });

          case 23:
            _context3.next = 40;
            break;

          case 25:
            _context3.prev = 25;
            _context3.t1 = _context3["catch"](0);
            errors = {};
            _context3.t2 = _context3.t1;
            _context3.next = _context3.t2 === "root_id is empty" ? 31 : _context3.t2 === "root is empty" ? 33 : _context3.t2 === "root_id is invalid" ? 35 : 37;
            break;

          case 31:
            errors.root_id = "フォルダIDが空のためフォルダツリーの取得に失敗しました";
            return _context3.abrupt("break", 39);

          case 33:
            errors.root_id = "指定されたフォルダが存在しないためフォルダツリーの取得に失敗しました";
            return _context3.abrupt("break", 39);

          case 35:
            errors.root_id = "フォルダIDが不正のためフォルダツリーの取得に失敗しました";
            return _context3.abrupt("break", 39);

          case 37:
            errors.unknown = _context3.t1;
            return _context3.abrupt("break", 39);

          case 39:
            res.status(400).json({
              status: {
                success: false,
                message: "フォルダツリーの取得に失敗しました",
                errors: errors
              }
            });

          case 40:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 25]]);
  }));

  return function tree(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.tree = tree;

var create = function create(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4() {
    var dir_name, dir_id, user, isPermitted, dir, role, tenant, inheritAuthSetting, inheritAuthEnabled, authorityFiles, is_current_user_and_role, parent, inheritAuths, _authorityFiles, _parent, _inheritAuths, duplicateAuths, authority, _authority, history, validationConditions, _dir, newDir, newAuthorities, tenant_id, updatedFile, descendantDirs, conditions, fields, files, sorted, findedDirs, dirTree, savedDirs, errors;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            dir_name = req.body.dir_name;
            dir_id = req.body.dir_id;

            if (!(dir_id === null || dir_id === undefined || dir_id === "")) {
              _context4.next = 5;
              break;
            }

            throw "dir_id is empty";

          case 5:
            if (ObjectId.isValid(dir_id)) {
              _context4.next = 7;
              break;
            }

            throw "dir_id is invalid";

          case 7:
            if (dir_name) {
              _context4.next = 9;
              break;
            }

            throw "dir_name is empty";

          case 9:
            if (!dir_name.match(new RegExp(constants.ILLIGAL_CHARACTERS.join("|")))) {
              _context4.next = 11;
              break;
            }

            throw "dir_name is invalid";

          case 11:
            _context4.next = 13;
            return _User["default"].findById(res.user._id);

          case 13:
            user = _context4.sent;
            _context4.next = 16;
            return (0, _files.checkFilePermission)(dir_id, user._id, constants.PERMISSION_MAKE_DIR);

          case 16:
            isPermitted = _context4.sent;

            if (!(isPermitted === false)) {
              _context4.next = 19;
              break;
            }

            throw "permission denied";

          case 19:
            // フォルダ情報を構築
            dir = new _File["default"]();
            dir.name = dir_name;
            dir.modified = (0, _moment["default"])().format("YYYY-MM-DD HH:mm:ss");
            dir.is_dir = true;
            dir.dir_id = dir_id;
            dir.is_display = true;
            dir.is_star = false;
            dir.tags = [];
            dir.histories = [];
            dir.authorities = [];
            _context4.next = 31;
            return _RoleFile["default"].findOne({
              tenant_id: _mongoose["default"].Types.ObjectId(res.user.tenant_id),
              name: "フルコントロール" // @fixme

            });

          case 31:
            role = _context4.sent;
            _context4.next = 34;
            return _Tenant["default"].findById(res.user.tenant_id);

          case 34:
            tenant = _context4.sent;
            _context4.next = 37;
            return _AppSetting["default"].findOne({
              tenant_id: _mongoose["default"].Types.ObjectId(res.user.tenant_id),
              name: _AppSetting["default"].INHERIT_PARENT_DIR_AUTH
            });

          case 37:
            inheritAuthSetting = _context4.sent;
            inheritAuthEnabled = inheritAuthSetting && inheritAuthSetting.enable;
            authorityFiles = [];

            is_current_user_and_role = function is_current_user_and_role(auth) {
              return auth.users !== undefined && auth.users !== null && auth.users.toString() === user._id.toString() && auth.role_files.toString() === role._id.toString();
            };

            if (!inheritAuthEnabled) {
              _context4.next = 50;
              break;
            }

            _context4.next = 44;
            return _File["default"].findById(dir_id);

          case 44:
            parent = _context4.sent;
            _context4.next = 47;
            return _AuthorityFile["default"].find({
              files: parent._id
            });

          case 47:
            inheritAuths = _context4.sent;
            _authorityFiles = inheritAuths.map(function (ihr) {
              return new _AuthorityFile["default"]({
                groups: ihr.groups === null ? null : _mongoose["default"].Types.ObjectId(ihr.groups),
                users: ihr.users === null ? null : _mongoose["default"].Types.ObjectId(ihr.users),
                files: dir,
                role_files: _mongoose["default"].Types.ObjectId(ihr.role_files),
                is_default: is_current_user_and_role(ihr)
              });
            });
            authorityFiles = authorityFiles.concat(_authorityFiles);

          case 50:
            if (!inheritAuthEnabled) {
              _context4.next = 61;
              break;
            }

            _context4.next = 53;
            return _File["default"].findById(dir_id);

          case 53:
            _parent = _context4.sent;
            _context4.next = 56;
            return _AuthorityFile["default"].find({
              files: _parent._id
            });

          case 56:
            _inheritAuths = _context4.sent;
            duplicateAuths = _inheritAuths.filter(function (ihr) {
              return is_current_user_and_role(ihr);
            });

            if (duplicateAuths.length === 0) {
              authority = new _AuthorityFile["default"]();
              authority.users = user._id;
              authority.files = dir._id;
              authority.role_files = role._id;
              authority.is_default = true;
              authorityFiles = authorityFiles.concat(authority);
            }

            _context4.next = 67;
            break;

          case 61:
            _authority = new _AuthorityFile["default"]();
            _authority.users = user._id;
            _authority.files = dir._id;
            _authority.role_files = role._id;
            _authority.is_default = true;
            authorityFiles = authorityFiles.concat(_authority);

          case 67:
            dir.authority_files = authorityFiles;
            history = {
              modified: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss"),
              user: user,
              action: "新規作成",
              body: ""
            };
            dir.histories = dir.histories.concat(history); // authoritiesを構築するためセッションからユーザ情報を抽出

            validationConditions = {
              name: dir_name,
              is_dir: true,
              dir_id: _mongoose["default"].Types.ObjectId(dir_id)
            };
            _context4.next = 73;
            return _File["default"].find(validationConditions);

          case 73:
            _dir = _context4.sent;

            if (!(_dir.length > 0)) {
              _context4.next = 76;
              break;
            }

            throw "name is duplication";

          case 76:
            _context4.next = 78;
            return dir.save();

          case 78:
            newDir = _context4.sent;
            _context4.next = 81;
            return authorityFiles.map(function (af) {
              return af.save();
            });

          case 81:
            newAuthorities = _context4.sent;
            // const { newDir, newAuthority} = yield { newDir: dir.save(), newAuthority: authority.save() };
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context4.next = 85;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(newDir._id)
            });

          case 85:
            updatedFile = _context4.sent;
            _context4.next = 88;
            return _elasticsearchclient["default"].createIndex(tenant_id, [updatedFile]);

          case 88:
            _context4.next = 90;
            return _Dir["default"].find({
              descendant: dir.dir_id
            }).sort({
              depth: 1
            });

          case 90:
            descendantDirs = _context4.sent;
            conditions = {
              _id: descendantDirs.map(function (dir) {
                return dir.ancestor;
              })
            };
            fields = {
              name: 1
            };
            _context4.next = 95;
            return _File["default"].find(conditions).select(fields);

          case 95:
            files = _context4.sent;
            sorted = descendantDirs.map(function (dir) {
              return files.filter(function (file) {
                return file.id == dir.ancestor;
              });
            }).reduce(function (a, b) {
              return a.concat(b);
            });
            findedDirs = [{
              _id: dir._id,
              name: dir.name
            }].concat(sorted);
            dirTree = findedDirs.map(function (dir, idx, all) {
              if (idx === 0) {
                return {
                  ancestor: dir._id,
                  descendant: dir._id,
                  depth: idx
                };
              } else {
                return {
                  ancestor: dir._id,
                  descendant: all[0]._id,
                  depth: idx
                };
              }
            });
            _context4.next = 101;
            return _Dir["default"].collection.insert(dirTree);

          case 101:
            savedDirs = _context4.sent;
            res.json({
              status: {
                success: true
              },
              body: dir
            });
            _context4.next = 127;
            break;

          case 105:
            _context4.prev = 105;
            _context4.t0 = _context4["catch"](0);
            errors = {};
            _context4.t1 = _context4.t0;
            _context4.next = _context4.t1 === "dir_id is empty" ? 111 : _context4.t1 === "dir_id is invalid" ? 113 : _context4.t1 === "dir_name is empty" ? 115 : _context4.t1 === "dir_name is invalid" ? 117 : _context4.t1 === "name is duplication" ? 119 : _context4.t1 === "permission denied" ? 121 : 123;
            break;

          case 111:
            errors.dir_id = "フォルダIDが空のためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 113:
            errors.dir_id = "フォルダIDが不正のためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 115:
            errors.dir_name = "フォルダ名が空のためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 117:
            errors.dir_name = "フォルダ名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 119:
            errors.dir_name = "同名のフォルダが存在するためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 121:
            errors.dir_id = "フォルダ作成権限がないためフォルダの作成に失敗しました";
            return _context4.abrupt("break", 125);

          case 123:
            errors.unknown = _context4.t0;
            return _context4.abrupt("break", 125);

          case 125:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "フォルダの作成に失敗しました",
                errors: errors
              }
            });

          case 127:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 105]]);
  }));
};

exports.create = create;

var move = function move(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    var moving_id, destination_id, _ref3, trash_dir_id, _user, isPermitted, destination_dir, movedDirs, i, defaultAuthArray, defaultAuth, docs, j, movedFiles, _i, _defaultAuthArray, _defaultAuth, _docs, _j, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            moving_id = _mongoose["default"].Types.ObjectId(req.params.moving_id); // 対象

            destination_id = _mongoose["default"].Types.ObjectId(req.body.destinationDir._id); // 行き先

            _context5.next = 5;
            return _Tenant["default"].findOne(res.user.tenant_id);

          case 5:
            _ref3 = _context5.sent;
            trash_dir_id = _ref3.trash_dir_id;

            if (!(moving_id.toString() === destination_id.toString())) {
              _context5.next = 9;
              break;
            }

            throw "target is the same as folder";

          case 9:
            _context5.next = 11;
            return _User["default"].findById(res.user._id);

          case 11:
            _user = _context5.sent;
            _context5.next = 14;
            return (0, _files.checkFilePermission)(moving_id, _user._id, constants.PERMISSION_MOVE);

          case 14:
            isPermitted = _context5.sent;

            if (isPermitted) {
              _context5.next = 17;
              break;
            }

            throw "permission denied";

          case 17:
            _context5.next = 19;
            return _File["default"].findById(destination_id);

          case 19:
            destination_dir = _context5.sent;
            _context5.next = 22;
            return moveDir(moving_id, destination_id, _user, "移動");

          case 22:
            _context5.t0 = function (d) {
              return d._id;
            };

            movedDirs = _context5.sent.map(_context5.t0);
            _context5.t1 = _regenerator["default"].keys(movedDirs);

          case 25:
            if ((_context5.t2 = _context5.t1()).done) {
              _context5.next = 47;
              break;
            }

            i = _context5.t2.value;
            _context5.next = 29;
            return _AuthorityFile["default"].find({
              files: movedDirs[i]._id,
              is_default: true
            });

          case 29:
            defaultAuthArray = _context5.sent;
            //デフォルト権限の取得
            defaultAuth = null;

            if (defaultAuthArray.length > 0) {
              defaultAuth = defaultAuthArray[0];
            }

            _context5.next = 34;
            return _AuthorityFile["default"].remove({
              files: movedDirs[i]._id,
              is_default: {
                $ne: true
              }
            });

          case 34:
            _context5.next = 36;
            return _AuthorityFile["default"].find({
              files: movedDirs[i].dir_id
            });

          case 36:
            docs = _context5.sent;
            _context5.t3 = _regenerator["default"].keys(docs);

          case 38:
            if ((_context5.t4 = _context5.t3()).done) {
              _context5.next = 45;
              break;
            }

            j = _context5.t4.value;

            if (_AuthorityFile["default"].equal(defaultAuth, docs[j])) {
              _context5.next = 43;
              break;
            }

            _context5.next = 43;
            return _AuthorityFile["default"].create({
              files: movedDirs[i]._id,
              role_files: docs[j].role_files,
              users: docs[j].users,
              groups: docs[j].groups,
              is_default: false
            });

          case 43:
            _context5.next = 38;
            break;

          case 45:
            _context5.next = 25;
            break;

          case 47:
            _context5.next = 49;
            return _File["default"].find({
              $or: [{
                _id: {
                  $in: movedDirs
                }
              }, {
                dir_id: {
                  $in: movedDirs
                }
              }]
            });

          case 49:
            movedFiles = _context5.sent;
            _context5.t5 = _regenerator["default"].keys(movedFiles);

          case 51:
            if ((_context5.t6 = _context5.t5()).done) {
              _context5.next = 81;
              break;
            }

            _i = _context5.t6.value;
            movedFiles[_i].is_trash = destination_dir.is_trash;
            _context5.next = 56;
            return movedFiles[_i].save();

          case 56:
            _context5.next = 58;
            return _AuthorityFile["default"].find({
              files: movedFiles[_i]._id,
              is_default: true
            });

          case 58:
            _defaultAuthArray = _context5.sent;
            //デフォルト権限の取得
            _defaultAuth = null;

            if (_defaultAuthArray.length > 0) {
              _defaultAuth = _defaultAuthArray[0];
            }

            _context5.next = 63;
            return _AuthorityFile["default"].remove({
              files: movedFiles[_i]._id,
              is_default: {
                $ne: true
              }
            });

          case 63:
            _context5.next = 65;
            return _AuthorityFile["default"].find({
              files: movedFiles[_i].dir_id
            });

          case 65:
            _docs = _context5.sent;
            _context5.t7 = _regenerator["default"].keys(_docs);

          case 67:
            if ((_context5.t8 = _context5.t7()).done) {
              _context5.next = 74;
              break;
            }

            _j = _context5.t8.value;

            if (_AuthorityFile["default"].equal(_defaultAuth, _docs[_j])) {
              _context5.next = 72;
              break;
            }

            _context5.next = 72;
            return _AuthorityFile["default"].create({
              files: movedFiles[_i]._id,
              role_files: _docs[_j].role_files,
              users: _docs[_j].users,
              groups: _docs[_j].groups,
              is_default: false
            });

          case 72:
            _context5.next = 67;
            break;

          case 74:
            _context5.next = 76;
            return _File["default"].searchFileOne({
              _id: movedFiles[_i]._id
            });

          case 76:
            updatedFile = _context5.sent;
            _context5.next = 79;
            return _elasticsearchclient["default"].createIndex(res.user.tenant_id, [updatedFile]);

          case 79:
            _context5.next = 51;
            break;

          case 81:
            // // フォルダ権限を移動先フォルダの権限に張替え
            // yield AuthorityFile.remove({ files: moved_dir._id })
            // const docs = yield AuthorityFile.find({ files: moved_dir.dir_id })
            // for (let i in docs ) {
            //   yield AuthorityFile.create({
            //     files: moved_dir._id,
            //     role_files: docs[i].role_files,
            //     users: docs[i].users,
            //     group: docs[i].group,
            //   })
            // }
            // // 移動したフォルダについて elasticsearch index更新
            // const { tenant_id }= res.user;
            // const updatedFile = yield File.searchFileOne({_id: mongoose.Types.ObjectId(moving_id) });
            // yield esClient.createIndex(tenant_id,[updatedFile]);
            res.json({
              status: {
                success: true
              },
              body: movedDirs
            });
            _context5.next = 101;
            break;

          case 84:
            _context5.prev = 84;
            _context5.t9 = _context5["catch"](0);
            errors = {};
            _context5.t10 = _context5.t9;
            _context5.next = _context5.t10 === "dir_id is invalid" ? 90 : _context5.t10 === "dir_id is empty" ? 92 : _context5.t10 === "target is the same as folder" ? 94 : _context5.t10 === "permission denied" ? 96 : 98;
            break;

          case 90:
            errors.dir_id = "指定されたフォルダが存在しないため移動に失敗しました";
            return _context5.abrupt("break", 100);

          case 92:
            errors.dir_id = "フォルダIDが不正のため移動に失敗しました";
            return _context5.abrupt("break", 100);

          case 94:
            errors.dir_id = "移動対象のフォルダと指定されたフォルダが同じため移動に失敗しました。";
            return _context5.abrupt("break", 100);

          case 96:
            errors.dir_id = "指定されたフォルダを移動する権限がないため移動に失敗しました";
            return _context5.abrupt("break", 100);

          case 98:
            errors.unknown = _context5.t9;
            return _context5.abrupt("break", 100);

          case 100:
            res.status(400).json({
              status: {
                success: false,
                status: false,
                message: "フォルダの移動に失敗しました",
                errors: errors
              }
            });

          case 101:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 84]]);
  }));
};

exports.move = move;

var moveDir = function moveDir(moving, destination, user, action) {
  var _move = function _move(moving_id, destination_id, user, action) {
    return (0, _co["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee6() {
      var dirs, insert_dirs, _moving, history, moved_dir;

      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(destination_id === undefined)) {
                _context6.next = 2;
                break;
              }

              throw "dir_id is invalid";

            case 2:
              _context6.next = 4;
              return _Dir["default"].find({
                depth: {
                  $gt: 0
                },
                descendant: moving_id
              }).remove();

            case 4:
              _context6.next = 6;
              return _Dir["default"].find({
                descendant: destination_id,
                depth: {
                  $gt: 0
                }
              });

            case 6:
              _context6.t0 = function (dir) {
                return {
                  ancestor: dir.ancestor,
                  descendant: moving_id,
                  depth: dir.depth + 1
                };
              };

              dirs = _context6.sent.map(_context6.t0);
              insert_dirs = dirs.concat({
                ancestor: destination_id,
                descendant: moving_id,
                depth: 1
              });
              _context6.next = 11;
              return _Dir["default"].collection.insert(insert_dirs);

            case 11:
              _context6.next = 13;
              return _File["default"].findById(moving_id);

            case 13:
              _moving = _context6.sent;
              _moving.dir_id = destination_id;
              history = {
                modified: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss"),
                user: user,
                action: action,
                body: {
                  _id: _moving._id,
                  is_star: _moving.is_star,
                  is_display: _moving.is_display,
                  dir_id: _moving.dir_id,
                  is_dir: _moving.is_dir,
                  size: _moving.size,
                  mime_type: _moving.mime_type,
                  blob_path: _moving.blob_path,
                  name: _moving.name,
                  meta_infos: _moving.meta_infos,
                  tags: _moving.tags,
                  is_deleted: _moving.is_deleted,
                  modified: _moving.modified,
                  __v: _moving.__v
                }
              };
              _moving.histories = _moving.histories.concat(history);
              _context6.next = 19;
              return _moving.save();

            case 19:
              moved_dir = _context6.sent;
              return _context6.abrupt("return", moved_dir);

            case 21:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
  };

  return (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7() {
    var childrenIds, childrenDirs, moved_dir, moved_dirs, idx, child;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _Dir["default"].find({
              ancestor: moving,
              depth: {
                $gt: 0
              }
            }).sort({
              "depth": 1
            });

          case 2:
            _context7.t0 = function (dir) {
              return dir.descendant;
            };

            childrenIds = _context7.sent.map(_context7.t0);
            _context7.next = 6;
            return _File["default"].find({
              _id: {
                $in: childrenIds
              }
            }).select({
              _id: 1,
              dir_id: 1
            });

          case 6:
            childrenDirs = _context7.sent;
            _context7.next = 9;
            return _move(moving, destination, user, action);

          case 9:
            moved_dir = _context7.sent;
            // 子を同じ位置に移動し直す
            moved_dirs = [];
            _context7.t1 = _regenerator["default"].keys(childrenIds);

          case 12:
            if ((_context7.t2 = _context7.t1()).done) {
              _context7.next = 22;
              break;
            }

            idx = _context7.t2.value;
            child = (0, _lodash.find)(childrenDirs, {
              _id: childrenIds[idx]
            });
            _context7.t3 = moved_dirs;
            _context7.next = 18;
            return _move(child._id, child.dir_id, user, action);

          case 18:
            _context7.t4 = _context7.sent;

            _context7.t3.push.call(_context7.t3, _context7.t4);

            _context7.next = 12;
            break;

          case 22:
            return _context7.abrupt("return", [moved_dir].concat(moved_dirs));

          case 23:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
};

exports.moveDir = moveDir;

var getDescendants = function getDescendants(dir_id) {};

exports.getDescendants = getDescendants;

var view = function view(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8() {
    var dir_id, file_ids, file, actions;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            // TODO: 詳細の取得処理はfiles.viewとほぼ同じなので共通化する.返却値に差があるので注意
            dir_id = req.params.dir_id; // デフォルトはテナントのホーム

            if (dir_id === undefined || dir_id === null || dir_id === "" || dir_id === "null") {
              dir_id = res.user.tenant.home_dir_id;
            }

            if (_mongoose["default"].Types.ObjectId.isValid(dir_id)) {
              _context8.next = 5;
              break;
            }

            throw new _AppError.ValidationError("ファイルIDが不正なためファイルの取得に失敗しました");

          case 5:
            _context8.next = 7;
            return (0, _files.isAllowedFileId)(dir_id, res.user._id, constants.PERMISSION_VIEW_DETAIL);

          case 7:
            file_ids = _context8.sent;

            if (file_ids) {
              _context8.next = 10;
              break;
            }

            throw new _AppError.PermisstionDeniedException("指定されたファイルが見つかりません");

          case 10:
            _context8.next = 12;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(dir_id)
            });

          case 12:
            file = _context8.sent;

            if (!(file === null || file === "" || file === undefined)) {
              _context8.next = 15;
              break;
            }

            throw new _AppError.RecordNotFoundException("指定されたファイルが見つかりません");

          case 15:
            if (!file.is_deleted) {
              _context8.next = 17;
              break;
            }

            throw new _AppError.RecordNotFoundException("ファイルは既に削除されているためファイルの取得に失敗しました");

          case 17:
            actions = (0, _files.extractFileActions)(file.authorities, res.user);
            res.json({
              status: {
                success: true
              },
              body: _objectSpread({}, file, {
                actions: actions
              })
            });
            _context8.next = 25;
            break;

          case 21:
            _context8.prev = 21;
            _context8.t0 = _context8["catch"](0);

            _logger["default"].error(_context8.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイルの取得に失敗しました",
                errors: _context8.t0
              }
            });

          case 25:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 21]]);
  }));
};

exports.view = view;