"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = require("express");

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _multer = _interopRequireDefault(require("multer"));

var _co = _interopRequireDefault(require("co"));

var _User = _interopRequireDefault(require("../models/User"));

var _Group = _interopRequireDefault(require("../models/Group"));

var _logstash = _interopRequireDefault(require("../logger/logstash"));

var _Test = _interopRequireDefault(require("../models/Test"));

var router = (0, _express.Router)();

var foo =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              _logstash["default"].info('ghogehogehogehogehogehgeo');

              res.json("success");
            } catch (err) {
              res.json(err);
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function foo(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

router.route("/").get(foo); // router.get("/", (req, res, next) => {
//   function* main() {
//     try {
//       yield new Promise( (resolve, reject) => {
//         setTimeout( () => resolve(), 1000);
//       });
//       const users = yield User.find();
//       const groups = yield Group.find();
//       res.json({users, groups});
//     }
//     catch (err) {
//       res.json(err);
//     }
//   }
//   co(main);
// });

router.get("/1", function (req, res, next) {
  var _marked =
  /*#__PURE__*/
  _regenerator["default"].mark(main);

  function main() {
    var payloads;
    return _regenerator["default"].wrap(function main$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return [_User["default"].find(), _Group["default"].find()];

          case 2:
            payloads = _context2.sent;
            res.json({
              users: payloads[0],
              groups: payloads[1]
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked);
  }

  (0, _co["default"])(main);
});
router.get("/2", function (req, res, next) {
  var _marked2 =
  /*#__PURE__*/
  _regenerator["default"].mark(main);

  function main() {
    return _regenerator["default"].wrap(function main$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            throw "runtime error";

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _marked2);
  }

  (0, _co["default"])(main)["catch"](function (err) {
    return res.json(err);
  });
});
router.get("/3", function (req, res, next) {
  var main =
  /*#__PURE__*/
  _regenerator["default"].mark(function main() {
    return _regenerator["default"].wrap(function main$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return new Promise(function (r) {
              return setTimeout(function () {
                return r();
              }, 1000);
            });

          case 3:
            res.json("success");
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            res.json(_context4.t0);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, main, null, [[0, 6]]);
  });

  (0, _co["default"])(main);
}); // router.get("/flow", (req, res, next) => {
//   const add = (a: number, b: number): number => a + b;
//   const result = add(1, 2);
//   res.json(result);
// });
// router.get("/flow1", (req, res, next) => {
//   const foo = (a: string): string => a + "!";
//   const result = foo(1);
//   res.json(result);
// });
// const upload = multer({ dest: "uploads/" });
// router.post("/", upload.fields([ { name: "myFile" } ]), (req, res, next) => {
//   const myFile = req.files.myFile[0];
//   const dir_id = req.body.dir_id;
//   console.log(myFile, dir_id);
//   res.json(myFile);
// });

var _default = router;
exports["default"] = _default;