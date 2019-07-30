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
var AuthoritySchema = (0, _mongoose.Schema)({
  files: _mongoose.Schema.Types.ObjectId,
  role_files: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'role_files'
  },
  users: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  groups: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  },
  is_default: _mongoose.Schema.Types.Boolean // デフォルトの権限

});
AuthoritySchema.index({
  files: 1
});
AuthoritySchema.index({
  role_files: 1
});
AuthoritySchema.index({
  users: 1
});
AuthoritySchema.index({
  groups: 1
});
/**
 * Authority の roles から actions を取得する
 * @param Object condition
 * @returns Array
 */

AuthoritySchema.statics.getActions = function (condition) {
  var _this = this;

  return (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var authorityActions, actions;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _this.aggregate({
              $match: condition
            }, {
              $lookup: {
                from: "role_files",
                localField: "role_files",
                foreignField: "_id",
                as: "roles"
              }
            }, {
              $unwind: "$roles"
            }, {
              $project: {
                roles: {
                  $filter: {
                    input: "$roles.actions",
                    as: "action",
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
                from: "actions",
                localField: "_id",
                foreignField: "_id",
                as: "actions"
              }
            }, {
              $project: {
                actions: 1,
                _id: false
              }
            }, {
              $unwind: "$actions"
            });

          case 3:
            authorityActions = _context.sent;
            actions = authorityActions.map(function (action) {
              return action.actions;
            });
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(actions);
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
}; // ２つの権限が同じものかどうか


AuthoritySchema.statics.equal = function (foo, bar) {
  var result = false;

  if (foo && bar && foo.role_files.toString() === bar.role_files.toString()) {
    if (foo.users && bar.users) {
      result = foo.users.toString() === bar.users.toString();
    } else if (foo.groups && bar.groups) {
      result = foo.groups.toString() === bar.groups.toString();
    }
  }

  return result;
};

var AuthorityFile = _mongoose["default"].model("authority_files", AuthoritySchema, "authority_files");

var _default = AuthorityFile;
exports["default"] = _default;