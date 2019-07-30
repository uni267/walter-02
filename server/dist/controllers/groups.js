"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRoleMenus = exports.updateDescription = exports.updateName = exports.remove = exports.view = exports.create = exports.index = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _Group = _interopRequireDefault(require("../models/Group"));

var _User = _interopRequireDefault(require("../models/User"));

var _RoleMenu = _interopRequireDefault(require("../models/RoleMenu"));

var _AuthorityMenu = _interopRequireDefault(require("../models/AuthorityMenu"));

var _logger = _interopRequireDefault(require("../logger"));

var _lodash = require("lodash");

var constants = _interopRequireWildcard(require("../configs/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ObjectId = _mongoose["default"].Types.ObjectId;

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var q, tenant_id, conditions, groups, group_ids, users, _groups, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            q = req.query.q;
            tenant_id = res.user.tenant_id;

            if (!(tenant_id === undefined || tenant_id === null || tenant_id === "")) {
              _context.next = 5;
              break;
            }

            throw "tenant_id is empty";

          case 5:
            if (q) {
              conditions = {
                $and: [{
                  name: new RegExp(q, "i")
                }, {
                  tenant_id: ObjectId(tenant_id)
                }]
              };
            } else {
              conditions = {
                $and: [{
                  tenant_id: ObjectId(tenant_id)
                }]
              };
            }

            _context.next = 8;
            return _Group["default"].find(conditions);

          case 8:
            groups = _context.sent;
            group_ids = groups.map(function (group) {
              return group._id;
            });
            _context.next = 12;
            return _User["default"].find({
              groups: {
                $in: group_ids
              }
            });

          case 12:
            users = _context.sent;
            _groups = groups.map(function (group) {
              var belongs_to = users.filter(function (user) {
                return user.groups.map(function (group) {
                  return group.toString();
                }).includes(group._id.toString());
              });
              return _objectSpread({}, group.toObject(), {
                belongs_to: belongs_to
              });
            });
            res.json({
              status: {
                success: true
              },
              body: _groups
            });
            _context.next = 28;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "tenant_id is empty" ? 23 : 25;
            break;

          case 23:
            errors.tenant_id = _context.t0;
            return _context.abrupt("break", 27);

          case 25:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 27);

          case 27:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 17]]);
  }));
};

exports.index = index;

var create = function create(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var group, _group, createdGroup, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            group = new _Group["default"](req.body.group);

            if (!(group.name === undefined || group.name === null || group.name === "")) {
              _context2.next = 4;
              break;
            }

            throw "name is empty";

          case 4:
            _context2.next = 6;
            return _Group["default"].findOne({
              name: group.name
            });

          case 6:
            _group = _context2.sent;

            if (!(_group !== null)) {
              _context2.next = 9;
              break;
            }

            throw "name is duplicate";

          case 9:
            group.tenant_id = res.user.tenant_id;
            _context2.next = 12;
            return group.save();

          case 12:
            createdGroup = _context2.sent;
            res.json({
              status: {
                success: true
              },
              body: createdGroup
            });
            _context2.next = 28;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0;
            _context2.next = _context2.t1 === "name is empty" ? 22 : _context2.t1 === "name is duplicate" ? 24 : 26;
            break;

          case 22:
            errors.name = "名称が空のため作成に失敗しました";
            return _context2.abrupt("break", 27);

          case 24:
            errors.name = "同名のグループが既に存在するため作成に失敗しました";
            return _context2.abrupt("break", 27);

          case 26:
            errors = _context2.t0;

          case 27:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16]]);
  }));
};

exports.create = create;

var view = function view(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var group_id, group, users, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            group_id = req.params.group_id;

            if (!(group_id === undefined || group_id === null || group_id === "")) {
              _context3.next = 4;
              break;
            }

            throw "group_id is empty";

          case 4:
            _context3.next = 6;
            return _Group["default"].findById(group_id);

          case 6:
            group = _context3.sent;

            if (!(group === null)) {
              _context3.next = 9;
              break;
            }

            throw "group is empty";

          case 9:
            _context3.next = 11;
            return _User["default"].find({
              groups: group._id
            });

          case 11:
            users = _context3.sent;
            res.json({
              status: {
                success: true
              },
              body: _objectSpread({}, group.toObject(), {
                belongs_to: users
              })
            });
            _context3.next = 28;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](0);
            errors = {};
            _context3.t1 = _context3.t0;
            _context3.next = _context3.t1 === "group_id is empty" ? 21 : _context3.t1 === "group is empty" ? 23 : 25;
            break;

          case 21:
            errors.group_id = _context3.t0;
            return _context3.abrupt("break", 27);

          case 23:
            errors.group = _context3.t0;
            return _context3.abrupt("break", 27);

          case 25:
            errors.unknown = _context3.t0;
            return _context3.abrupt("break", 27);

          case 27:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 15]]);
  }));
};

exports.view = view;

var remove = function remove(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4() {
    var group_id, group, removedGroup, errors;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            group_id = req.params.group_id;
            _context4.prev = 1;
            _context4.next = 4;
            return _Group["default"].findById(group_id);

          case 4:
            group = _context4.sent;

            if (!(group === undefined || group === null)) {
              _context4.next = 7;
              break;
            }

            throw "group not found";

          case 7:
            _context4.next = 9;
            return group.remove();

          case 9:
            removedGroup = _context4.sent;
            res.json({
              status: {
                success: true
              },
              body: removedGroup
            });
            _context4.next = 24;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](1);
            errors = {};
            _context4.t1 = _context4.t0;
            _context4.next = _context4.t1 === "group not found" ? 19 : 21;
            break;

          case 19:
            errors.group = "指定されたグループが見つかりません";
            return _context4.abrupt("break", 23);

          case 21:
            errors = _context4.t0;
            return _context4.abrupt("break", 23);

          case 23:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 13]]);
  }));
};

exports.remove = remove;

var updateName = function updateName(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    var name, group_id, group, changedGroup, errors;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            name = req.body.name;

            if (!(name === null || name === undefined || name === "")) {
              _context5.next = 4;
              break;
            }

            throw "name is empty";

          case 4:
            if (!(name.length >= constants.MAX_STRING_LENGTH)) {
              _context5.next = 6;
              break;
            }

            throw "name is too long";

          case 6:
            group_id = req.params.group_id;

            if (_mongoose["default"].Types.ObjectId.isValid(group_id)) {
              _context5.next = 9;
              break;
            }

            throw "group_id is invalid";

          case 9:
            _context5.next = 11;
            return _Group["default"].findById(group_id);

          case 11:
            group = _context5.sent;

            if (!(group === null)) {
              _context5.next = 14;
              break;
            }

            throw "group is not found";

          case 14:
            group.name = name;
            _context5.next = 17;
            return group.save();

          case 17:
            changedGroup = _context5.sent;
            res.json({
              status: {
                success: true
              },
              body: changedGroup
            });
            _context5.next = 38;
            break;

          case 21:
            _context5.prev = 21;
            _context5.t0 = _context5["catch"](0);
            errors = {};
            _context5.t1 = _context5.t0;
            _context5.next = _context5.t1 === "name is empty" ? 27 : _context5.t1 === "name is too long" ? 29 : _context5.t1 === "group is not found" ? 31 : _context5.t1 === "group_id is invalid" ? 33 : 35;
            break;

          case 27:
            errors.name = "グループ名が空のためグループ名の変更に失敗しました";
            return _context5.abrupt("break", 37);

          case 29:
            errors.name = "\u30B0\u30EB\u30FC\u30D7\u540D\u304C\u5236\u9650\u6587\u5B57\u6570(".concat(constants.MAX_STRING_LENGTH, ")\u3092\u8D85\u904E\u3057\u305F\u305F\u3081\u30B0\u30EB\u30FC\u30D7\u540D\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
            return _context5.abrupt("break", 37);

          case 31:
            errors.group = "指定されたグループが見つからないためグループ名の変更に失敗しました";
            return _context5.abrupt("break", 37);

          case 33:
            errors.group_id = "グループIDが不正のためグループ名の変更に失敗しました";
            return _context5.abrupt("break", 37);

          case 35:
            errors.unknown = _context5.t0;
            return _context5.abrupt("break", 37);

          case 37:
            res.status(400).json({
              status: {
                success: false,
                message: "グループ名の変更に失敗しました",
                errors: errors
              }
            });

          case 38:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 21]]);
  }));
};

exports.updateName = updateName;

var updateDescription = function updateDescription(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6() {
    var description, group_id, group, changedGroup, errors;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            description = req.body.description;
            group_id = req.params.group_id;
            _context6.prev = 2;

            if (ObjectId.isValid(group_id)) {
              _context6.next = 5;
              break;
            }

            throw "group_id is invalid";

          case 5:
            _context6.next = 7;
            return _Group["default"].findById(group_id);

          case 7:
            group = _context6.sent;

            if (!(group === null || group === undefined)) {
              _context6.next = 10;
              break;
            }

            throw "group is not found";

          case 10:
            if (!(description.length >= constants.MAX_STRING_LENGTH)) {
              _context6.next = 12;
              break;
            }

            throw "description is too long";

          case 12:
            group.description = description;
            _context6.next = 15;
            return group.save();

          case 15:
            changedGroup = _context6.sent;
            res.json({
              status: {
                success: true
              },
              body: changedGroup
            });
            _context6.next = 34;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](2);
            errors = {};
            _context6.t1 = _context6.t0;
            _context6.next = _context6.t1 === "group_id is invalid" ? 25 : _context6.t1 === "group is not found" ? 27 : _context6.t1 === "description is too long" ? 29 : 31;
            break;

          case 25:
            errors.group_id = "グループIDが不正のためグループの備考の変更に失敗しました";
            return _context6.abrupt("break", 33);

          case 27:
            errors.group = "指定されたグループが見つかりませんでした";
            return _context6.abrupt("break", 33);

          case 29:
            errors.description = "\u30B0\u30EB\u30FC\u30D7\u306E\u5099\u8003\u304C\u5236\u9650\u6587\u5B57\u6570(".concat(constants.MAX_STRING_LENGTH, ")\u3092\u8D85\u904E\u3057\u305F\u305F\u3081\u30B0\u30EB\u30FC\u30D7\u306E\u5099\u8003\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
            return _context6.abrupt("break", 33);

          case 31:
            errors.unknown = _context6.t0;
            return _context6.abrupt("break", 33);

          case 33:
            res.status(400).json({
              status: {
                success: false,
                message: "グループの備考の変更に失敗しました",
                errors: errors
              }
            });

          case 34:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 19]]);
  }));
};

exports.updateDescription = updateDescription;

var updateRoleMenus = function updateRoleMenus(req, res) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7() {
    var group_id, role_menu_id, _ref, _ref2, group, role, authorityMenus, savedAuthorityMenus, errors;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            group_id = req.params.group_id;
            role_menu_id = req.body.role_menu_id;

            if (ObjectId.isValid(group_id)) {
              _context7.next = 5;
              break;
            }

            throw "group_id is invalid";

          case 5:
            if (!(role_menu_id === undefined || role_menu_id === null || role_menu_id === "")) {
              _context7.next = 7;
              break;
            }

            throw "role_menu_id is empty";

          case 7:
            if (ObjectId.isValid(role_menu_id)) {
              _context7.next = 9;
              break;
            }

            throw "role_menu_id is invalid";

          case 9:
            _context7.next = 11;
            return [_Group["default"].findById(group_id), _RoleMenu["default"].findById(role_menu_id)];

          case 11:
            _ref = _context7.sent;
            _ref2 = (0, _slicedToArray2["default"])(_ref, 2);
            group = _ref2[0];
            role = _ref2[1];

            if (!(group === null)) {
              _context7.next = 17;
              break;
            }

            throw "group is empty";

          case 17:
            if (!(role === null)) {
              _context7.next = 19;
              break;
            }

            throw "role is empty";

          case 19:
            _context7.t0 = _lodash.first;
            _context7.next = 22;
            return _AuthorityMenu["default"].find({
              users: ObjectId(group._id)
            });

          case 22:
            _context7.t1 = _context7.sent;
            authorityMenus = (0, _context7.t0)(_context7.t1);

            if (authorityMenus === undefined) {
              authorityMenus = new _AuthorityMenu["default"]();
              authorityMenus.groups = group;
            }

            authorityMenus.role_menus = role;
            _context7.next = 28;
            return authorityMenus.save();

          case 28:
            savedAuthorityMenus = _context7.sent;
            res.json({
              status: {
                success: true
              },
              body: savedAuthorityMenus
            });
            _context7.next = 52;
            break;

          case 32:
            _context7.prev = 32;
            _context7.t2 = _context7["catch"](0);
            errors = {};
            _context7.t3 = _context7.t2;
            _context7.next = _context7.t3 === "group_id is invalid" ? 38 : _context7.t3 === "role_menu_id is empty" ? 40 : _context7.t3 === "group is empty" ? 42 : _context7.t3 === "role_menu_id is invalid" ? 44 : _context7.t3 === "role is empty" ? 46 : 48;
            break;

          case 38:
            errors.group_id = "グループIDが不正のためグループのメニュー権限の変更に失敗しました";
            return _context7.abrupt("break", 50);

          case 40:
            errors.role_menu_id = "メニュー権限IDが空のためグループのメニュー権限の変更に失敗しました";
            return _context7.abrupt("break", 50);

          case 42:
            errors.group = "存在しないグループです";
            return _context7.abrupt("break", 50);

          case 44:
            errors.role_menu_id = "指定されたメニュー権限IDが不正のためグループのメニュー権限の変更に失敗しました";
            return _context7.abrupt("break", 50);

          case 46:
            errors.role_menu_id = "指定されたメニュー権限が存在しないためグループのメニュー権限の変更に失敗しました";
            return _context7.abrupt("break", 50);

          case 48:
            errors.unknown = _context7.t2;
            return _context7.abrupt("break", 50);

          case 50:
            _logger["default"].error(_context7.t2);

            res.status(400).json({
              status: {
                success: false,
                message: "グループのメニュー権限の変更に失敗しました",
                errors: errors
              }
            });

          case 52:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 32]]);
  }));
};

exports.updateRoleMenus = updateRoleMenus;