"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeMenuOfRoleMenu = exports.addMenuToRoleMenu = exports.updateDescription = exports.updateName = exports.remove = exports.view = exports.create = exports.index = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _RoleMenu = _interopRequireDefault(require("../models/RoleMenu"));

var _Menu = _interopRequireDefault(require("../models/Menu"));

var _logger = _interopRequireDefault(require("../logger"));

var commons = _interopRequireWildcard(require("./commons"));

var _AppError = require("../errors/AppError");

var constants = _interopRequireWildcard(require("../configs/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ObjectId = _mongoose["default"].Types.ObjectId;

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_id, roles, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            tenant_id = res.user.tenant_id;
            _context.next = 4;
            return _RoleMenu["default"].aggregate([{
              $match: {
                tenant_id: ObjectId(tenant_id)
              }
            }, {
              $lookup: {
                from: "menus",
                localField: "menus",
                foreignField: "_id",
                as: "menus"
              }
            }]);

          case 4:
            roles = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: roles
            });
            _context.next = 17;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = 14;
            break;

          case 14:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 16);

          case 16:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
};

exports.index = index;

var create = function create(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var roleMenu, _role, newRoleMenu, createRoleMenu, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            roleMenu = req.body.roleMenu;

            if (!(roleMenu.name === undefined || roleMenu.name === null || roleMenu.name === "")) {
              _context2.next = 4;
              break;
            }

            throw new _AppError.ValidationError("name is empty");

          case 4:
            if (!(roleMenu.name.length > constants.MAX_STRING_LENGTH)) {
              _context2.next = 6;
              break;
            }

            throw new _AppError.ValidationError("name is too long");

          case 6:
            if (!(roleMenu.description !== undefined && roleMenu.description !== null && roleMenu.description.length > constants.MAX_STRING_LENGTH)) {
              _context2.next = 8;
              break;
            }

            throw new _AppError.ValidationError("description is too long");

          case 8:
            _context2.next = 10;
            return _RoleMenu["default"].findOne({
              name: roleMenu.name,
              tenant_id: res.user.tenant_id
            });

          case 10:
            _role = _context2.sent;

            if (!(_role !== null)) {
              _context2.next = 13;
              break;
            }

            throw new _AppError.ValidationError("name is duplicate");

          case 13:
            newRoleMenu = new _RoleMenu["default"]();
            newRoleMenu.name = roleMenu.name;
            newRoleMenu.description = roleMenu.description;
            newRoleMenu.tenant_id = res.user.tenant_id;
            _context2.next = 19;
            return newRoleMenu.save();

          case 19:
            createRoleMenu = _context2.sent;
            res.json({
              status: {
                success: true
              },
              body: createRoleMenu
            });
            _context2.next = 40;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0.message;
            _context2.next = _context2.t1 === "name is empty" ? 29 : _context2.t1 === "name is duplicate" ? 31 : _context2.t1 === "name is too long" ? 33 : _context2.t1 === "description is too long" ? 35 : 37;
            break;

          case 29:
            errors.name = "ユーザタイプ名が空です";
            return _context2.abrupt("break", 38);

          case 31:
            errors.name = "そのユーザタイプ名は既に使用されています";
            return _context2.abrupt("break", 38);

          case 33:
            errors.name = "ユーザタイプ名が長すぎます";
            return _context2.abrupt("break", 38);

          case 35:
            errors.description = "備考が長すぎます";
            return _context2.abrupt("break", 38);

          case 37:
            errors.unknown = commons.errorParser(_context2.t0);

          case 38:
            _logger["default"].error(_context2.t0);

            res.status(400).json({
              status: {
                success: false,
                message: 'ユーザタイプの作成に失敗しました',
                errors: errors
              }
            });

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 23]]);
  }));
};

exports.create = create;

var view = function view(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var role_id, role, menus, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            role_id = req.params.role_id;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context3.next = 4;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 4:
            _context3.next = 6;
            return _RoleMenu["default"].findById(role_id);

          case 6:
            role = _context3.sent;

            if (!(role === null || role === undefined)) {
              _context3.next = 9;
              break;
            }

            throw new _AppError.ValidationError("role is not found");

          case 9:
            _context3.next = 11;
            return _Menu["default"].find({
              _id: {
                $in: role.menus
              }
            });

          case 11:
            menus = _context3.sent;
            res.json({
              status: {
                success: true
              },
              body: _objectSpread({}, role.toObject(), {
                menus: menus
              })
            });
            _context3.next = 28;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](0);
            errors = {};
            _context3.t1 = _context3.t0.message;
            _context3.next = _context3.t1 === "role_id is not valid" ? 21 : _context3.t1 === "role is not found" ? 23 : 25;
            break;

          case 21:
            errors.role_id = "ロールIDが不正なためユーザタイプを取得に失敗しました";
            return _context3.abrupt("break", 27);

          case 23:
            errors.role = "ユーザタイプが存在しません";
            return _context3.abrupt("break", 27);

          case 25:
            errors.unknown = commons.errorParser(_context3.t0);
            return _context3.abrupt("break", 27);

          case 27:
            res.status(400).json({
              status: {
                success: false,
                message: "ユーザタイプの取得に失敗しました",
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
    var role_id, role, deletedRoleMenu, errors;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            role_id = req.params.role_id;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context4.next = 4;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 4:
            _context4.next = 6;
            return _RoleMenu["default"].findById(role_id);

          case 6:
            role = _context4.sent;

            if (!(role === null)) {
              _context4.next = 9;
              break;
            }

            throw new _AppError.RecordNotFoundException("role is empty");

          case 9:
            deletedRoleMenu = role.remove();
            res.json({
              status: {
                success: true
              },
              body: deletedRoleMenu
            });
            _context4.next = 26;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](0);
            errors = {};
            _context4.t1 = _context4.t0.message;
            _context4.next = _context4.t1 === "role_id is not valid" ? 19 : _context4.t1 === "role is empty" ? 21 : 23;
            break;

          case 19:
            errors.role_id = "ロールIDが不正なためユーザタイプを削除に失敗しました";
            return _context4.abrupt("break", 25);

          case 21:
            errors.role = "指定されたユーザタイプが見つからないため削除に失敗しました";
            return _context4.abrupt("break", 25);

          case 23:
            errors.unknown = commons.errorParser(_context4.t0);
            return _context4.abrupt("break", 25);

          case 25:
            res.status(400).json({
              status: {
                success: false,
                message: "ユーザタイプの削除に失敗しました",
                errors: errors
              }
            });

          case 26:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 13]]);
  }));
};

exports.remove = remove;

var updateName = function updateName(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    var role_id, name, _roleCount, role, changedRoleMenu, errors;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            role_id = req.params.role_id;
            name = req.body.name;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context5.next = 5;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 5:
            if (!(name === undefined || name === null || name === "")) {
              _context5.next = 7;
              break;
            }

            throw new _AppError.ValidationError("name is empty");

          case 7:
            if (!(name.length > constants.MAX_STRING_LENGTH)) {
              _context5.next = 9;
              break;
            }

            throw new _AppError.ValidationError("name is too long");

          case 9:
            _context5.next = 11;
            return _RoleMenu["default"].find({
              name: name
            }).count();

          case 11:
            _roleCount = _context5.sent;

            if (!(_roleCount > 0)) {
              _context5.next = 14;
              break;
            }

            throw new _AppError.ValidationError("name is duplicate");

          case 14:
            _context5.next = 16;
            return _RoleMenu["default"].findById(role_id);

          case 16:
            role = _context5.sent;

            if (!(role === undefined || role === null)) {
              _context5.next = 19;
              break;
            }

            throw new _AppError.RecordNotFoundException("role is not found");

          case 19:
            role.name = name;
            _context5.next = 22;
            return role.save();

          case 22:
            changedRoleMenu = _context5.sent;
            res.json({
              status: {
                success: true
              },
              body: changedRoleMenu
            });
            _context5.next = 46;
            break;

          case 26:
            _context5.prev = 26;
            _context5.t0 = _context5["catch"](0);
            errors = {};
            _context5.t1 = _context5.t0.message;
            _context5.next = _context5.t1 === "role_id is not valid" ? 32 : _context5.t1 === "name is empty" ? 34 : _context5.t1 === "name is duplicate" ? 36 : _context5.t1 === "name is too long" ? 38 : _context5.t1 === "role is not found" ? 40 : 42;
            break;

          case 32:
            errors.role_id = "ロールIDが不正なためユーザタイプ名の変更に失敗しました";
            return _context5.abrupt("break", 44);

          case 34:
            errors.name = "ユーザタイプ名が空です";
            return _context5.abrupt("break", 44);

          case 36:
            errors.name = "そのユーザタイプ名は既に使用されています";
            return _context5.abrupt("break", 44);

          case 38:
            errors.name = "ユーザタイプ名が長すぎます";
            return _context5.abrupt("break", 44);

          case 40:
            errors.role = "指定されたユーザタイプが見つからないため変更に失敗しました";
            return _context5.abrupt("break", 44);

          case 42:
            errors.unknown = _context5.t0;
            return _context5.abrupt("break", 44);

          case 44:
            _logger["default"].error(_context5.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "ユーザタイプ名の変更に失敗しました",
                errors: errors
              }
            });

          case 46:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 26]]);
  }));
};

exports.updateName = updateName;

var updateDescription = function updateDescription(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6() {
    var role_id, description, role, changedRoleMenu, errors;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            role_id = req.params.role_id;
            description = req.body.description;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context6.next = 5;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 5:
            _context6.next = 7;
            return _RoleMenu["default"].findById(role_id);

          case 7:
            role = _context6.sent;

            if (!(role === undefined || role === null)) {
              _context6.next = 10;
              break;
            }

            throw new _AppError.ValidationError("role is not found");

          case 10:
            role.description = description;
            _context6.next = 13;
            return role.save();

          case 13:
            changedRoleMenu = _context6.sent;
            res.json({
              status: {
                success: true
              },
              body: changedRoleMenu
            });
            _context6.next = 31;
            break;

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](0);
            errors = {};
            _context6.t1 = _context6.t0.message;
            _context6.next = _context6.t1 === "role_id is not valid" ? 23 : _context6.t1 === "role is not found" ? 25 : 27;
            break;

          case 23:
            errors.role_id = "ロールIDが不正なため備考の変更に失敗しました";
            return _context6.abrupt("break", 29);

          case 25:
            errors.role = "指定されたユーザタイプが見つからないため変更に失敗しました";
            return _context6.abrupt("break", 29);

          case 27:
            errors.unknown = commons.errorParser(_context6.t0);
            return _context6.abrupt("break", 29);

          case 29:
            _logger["default"].error(_context6.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "備考の変更に失敗しました",
                errors: errors
              }
            });

          case 31:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 17]]);
  }));
};

exports.updateDescription = updateDescription;

var addMenuToRoleMenu = function addMenuToRoleMenu(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7() {
    var _req$params, role_id, menu_id, _ref, _ref2, role, menu, changedRoleMenu, errors;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _req$params = req.params, role_id = _req$params.role_id, menu_id = _req$params.menu_id;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context7.next = 4;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 4:
            _context7.next = 6;
            return [_RoleMenu["default"].findById(role_id), _Menu["default"].findById(menu_id)];

          case 6:
            _ref = _context7.sent;
            _ref2 = (0, _slicedToArray2["default"])(_ref, 2);
            role = _ref2[0];
            menu = _ref2[1];

            if (!(role === null)) {
              _context7.next = 12;
              break;
            }

            throw new _AppError.ValidationError("role is empty");

          case 12:
            if (!(menu === null)) {
              _context7.next = 14;
              break;
            }

            throw new _AppError.ValidationError("menu is empty");

          case 14:
            if (!(role.menus.indexOf(menu._id) >= 0)) {
              _context7.next = 16;
              break;
            }

            throw new _AppError.ValidationError("menu is duplicate");

          case 16:
            role.menus = [].concat((0, _toConsumableArray2["default"])(role.menus), [menu._id]);
            _context7.next = 19;
            return role.save();

          case 19:
            changedRoleMenu = _context7.sent;
            res.json({
              status: {
                success: true
              },
              body: changedRoleMenu
            });
            _context7.next = 41;
            break;

          case 23:
            _context7.prev = 23;
            _context7.t0 = _context7["catch"](0);
            errors = {};
            _context7.t1 = _context7.t0.message;
            _context7.next = _context7.t1 === "role_id is not valid" ? 29 : _context7.t1 === "role is empty" ? 31 : _context7.t1 === "menu is empty" ? 33 : _context7.t1 === "menu is duplicate" ? 35 : 37;
            break;

          case 29:
            errors.role_id = "ロールIDが不正なためメニューの追加に失敗しました";
            return _context7.abrupt("break", 39);

          case 31:
            errors.role = "指定されたユーザタイプが見つからないためメニューの追加に失敗しました";
            return _context7.abrupt("break", 39);

          case 33:
            errors.menu = "指定されたメニューが見つからないため追加に失敗しました";
            return _context7.abrupt("break", 39);

          case 35:
            errors.menu = "指定されたメニューが既に登録されているため追加に失敗しました";
            return _context7.abrupt("break", 39);

          case 37:
            errors.unknown = commons.errorParser(_context7.t0);
            return _context7.abrupt("break", 39);

          case 39:
            _logger["default"].error(_context7.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "メニューの追加に失敗しました",
                errors: errors
              }
            });

          case 41:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 23]]);
  }));
};

exports.addMenuToRoleMenu = addMenuToRoleMenu;

var removeMenuOfRoleMenu = function removeMenuOfRoleMenu(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8() {
    var _req$params2, role_id, menu_id, _ref3, _ref4, role, menu, changedRoleMenu, errors;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _req$params2 = req.params, role_id = _req$params2.role_id, menu_id = _req$params2.menu_id;

            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context8.next = 4;
              break;
            }

            throw new _AppError.ValidationError("role_id is not valid");

          case 4:
            _context8.next = 6;
            return [_RoleMenu["default"].findById(role_id), _Menu["default"].findById(menu_id)];

          case 6:
            _ref3 = _context8.sent;
            _ref4 = (0, _slicedToArray2["default"])(_ref3, 2);
            role = _ref4[0];
            menu = _ref4[1];

            if (!(role === null)) {
              _context8.next = 12;
              break;
            }

            throw new _AppError.ValidationError("role is empty");

          case 12:
            if (!(menu === null)) {
              _context8.next = 14;
              break;
            }

            throw new _AppError.ValidationError("menu is empty");

          case 14:
            if (!(role.menus.indexOf(menu_id) === -1)) {
              _context8.next = 16;
              break;
            }

            throw new _AppError.ValidationError("menu is not exist");

          case 16:
            role.menus = role.menus.filter(function (_menus) {
              return _menus.toString() !== menu._id.toString();
            });
            _context8.next = 19;
            return role.save();

          case 19:
            changedRoleMenu = _context8.sent;
            res.json({
              status: {
                success: true
              },
              body: changedRoleMenu
            });
            _context8.next = 41;
            break;

          case 23:
            _context8.prev = 23;
            _context8.t0 = _context8["catch"](0);
            errors = {};
            _context8.t1 = _context8.t0.message;
            _context8.next = _context8.t1 === "role_id is not valid" ? 29 : _context8.t1 === "role is empty" ? 31 : _context8.t1 === "menu is empty" ? 33 : _context8.t1 === "menu is not exist" ? 35 : 37;
            break;

          case 29:
            errors.role_id = "ロールIDが不正です";
            return _context8.abrupt("break", 39);

          case 31:
            errors.role = "指定されたユーザタイプが見つからないためメニューの削除に失敗しました";
            return _context8.abrupt("break", 39);

          case 33:
            errors.menu = "指定されたメニューが見つからないため削除に失敗しました";
            return _context8.abrupt("break", 39);

          case 35:
            errors.menu = "指定されたメニューは登録されていないため削除に失敗しました";
            return _context8.abrupt("break", 39);

          case 37:
            errors.unknown = commons.errorParser(_context8.t0);
            return _context8.abrupt("break", 39);

          case 39:
            _logger["default"].error(_context8.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "メニューの削除に失敗しました",
                errors: errors
              }
            });

          case 41:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 23]]);
  }));
};

exports.removeMenuOfRoleMenu = removeMenuOfRoleMenu;