"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _logger = require("../logger");

var _co = _interopRequireDefault(require("co"));

_mongoose["default"].Promise = global.Promise;
var AuthorityMenuSchema = (0, _mongoose.Schema)({
  role_menus: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'role_menus'
  },
  users: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  groups: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  }
});
AuthorityMenuSchema.index({
  role_menus: 1
});
AuthorityMenuSchema.index({
  users: 1
});
AuthorityMenuSchema.index({
  groups: 1
});
/**
 * Authority の roles から actions を取得する
 * @param Object condition
 * @returns Array
 */

AuthorityMenuSchema.statics.getMenus = function (condition) {
  var _this = this;

  return (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var authorityMenus, menus;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _this.aggregate([{
              $match: condition
            }, {
              $lookup: {
                from: "role_menus",
                localField: "role_menus",
                foreignField: "_id",
                as: "roles"
              }
            }, {
              $unwind: "$roles"
            }, {
              $project: {
                roles: {
                  $filter: {
                    input: "$roles.menus",
                    as: "menu",
                    cond: {}
                  }
                },
                _id: false
              }
            }, {
              $unwind: "$roles"
            }, {
              $group: {
                _id: "$roles"
              }
            }, // 重複をまとめる
            {
              $lookup: {
                from: "menus",
                localField: "_id",
                foreignField: "_id",
                as: "menus"
              }
            }, {
              $project: {
                _id: 0,
                menus: {
                  $arrayElemAt: ["$menus", 0]
                }
              }
            }]);

          case 3:
            authorityMenus = _context.sent;
            menus = authorityMenus.map(function (menu) {
              return menu.menus;
            });
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(menus);
            }));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
};

var AuthorityMenu = _mongoose["default"].model("authority_menus", AuthorityMenuSchema, "authority_menus");

var _default = AuthorityMenu;
exports["default"] = _default;