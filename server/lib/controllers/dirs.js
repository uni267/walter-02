import co from "co";
import moment from "moment";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { logger } from "../logger";

import { SECURITY_CONF } from "../../configs/server";
import Dir from "../models/Dir";
import File from "../models/File";
import Tenant from "../models/Tenant";
import User from "../models/User";
import RoleFile from "../models/RoleFile";
import AuthorityFile from "../models/AuthorityFile";

export const index = (req, res, next) => {
  co(function* () {
    try {
      let { dir_id } = req.query;

      // デフォルトはテナントのホーム
      if (dir_id === undefined ||
          dir_id === null ||
          dir_id === "") {

        const tenant = yield Tenant.findById(res.user.tenant_id);
        dir_id = tenant.home_dir_id;
      }

      const dirs = yield Dir.find({ descendant: dir_id })
            .sort({ depth: -1 });

      const files = yield File.find({ _id: dirs.map( dir => dir.ancestor ) })
            .select({ name: 1 });

      const sorted = dirs.map( dir => {
        return files.filter( file => file._id.toString() === dir.ancestor.toString() );
      }).reduce( (a, b) => a.concat(b));

      const withSep = [].concat.apply([], sorted.map( (dir, idx) => {
        return ( idx === 0 ) ? dir : [ "sep", dir ];
      }));

      res.json({
        status: { success: true },
        body: withSep
      });
    }
    catch (e) {
      let errors = {};
      errors.unknown = e;

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const tree = (req, res, next) => {
  co(function* () {
    try {
      const { root_id } = req.query;
      if (root_id === undefined ||
          root_id === null ||
          root_id === "") throw "root_id is empty";

      const root = yield File.findById(root_id);

      if (root === null) throw "root is empty";

      const dirs = yield Dir.aggregate([
        { $match: { ancestor: root._id, depth: 1 } },
        { $lookup:
          {
            from: "files",
            localField: "descendant",
            foreignField: "_id",
            as: "descendant"
          }
        }
      ]);

      if (dirs.length === 0) {
        res.json({
          _id: root._id,
          name: root.name,
          children: []
        });
      } else {

        const children = dirs.map(dir => {
          if (dir.descendant[0].is_display) {
            return {
              _id: dir.descendant[0]._id,
              name: dir.descendant[0].name
            };
          } else {
            return null;
          }
        }).filter( child => child !== null);

        res.json({
          status: { success: true },
          body: {
            _id: root._id,
            name: root.name,
            children: children
          }
        });

      }
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "root_id is empty":
        errors.root_id = e;
        break;
      case "root is empty":
        errors.root = e;
        break;
      default:
        errors.unknown = e;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const create = (req, res, next) => {
  co(function*(){
    try {

      const { dir_name } = req.body;
      let dir_id = req.body.dir_id;
      if (dir_id === null ||
        dir_id === undefined ||
        dir_id === "" ||
        dir_id === "undefined") {

        dir_id = res.user.tenant.home_dir_id;
      }

      if (!dir_name) {
        res.status(400).json({
          status: {
            success: false,
            message: "フォルダ名が空のためエラー",
            errors: { dirName: "フォルダ名が空のため作成に失敗しました"}
          },
          body: {}
        });
        return;
      }

      // フォルダ情報を構築
      const dir = new File();
      dir.name = dir_name;
      dir.modified = moment().format("YYYY-MM-DD HH:mm:ss");
      dir.is_dir = true;
      dir.dir_id = dir_id;
      dir.is_display = true;
      dir.is_star = false;
      dir.tags = [];
      dir.histories = [];
      dir.authorities = [];

      const role = yield RoleFile.findOne({
        tenant_id: mongoose.Types.ObjectId(res.user.tenant_id),
        name: "フルコントロール" // @fixme
      });

      const user = yield User.findById(res.user._id);

      // 作成したユーザが所有者となる
      const authority = new AuthorityFile();
      authority.users = user;
      authority.files = dir;
      authority.role_files = role;
      dir.authority_files = [ authority ];

      const history = {
        modified: moment().format("YYYY-MM-DD hh:mm:ss"),
        user: user,
        action: "新規作成",
        body: ""
      };

      dir.histories = dir.histories.concat(history);

      // authoritiesを構築するためセッションからユーザ情報を抽出
      const validationConditions = {
        name: dir_name,
        is_dir: true,
        dir_id: mongoose.Types.ObjectId(dir_id)
      };

      const _dir = yield File.find(validationConditions);

      if (_dir.length > 0) throw "name is duplication";

      const { newDir, newAuthority} = yield { newDir: dir.save(), newAuthority: authority.save() };

      const descendantDirs = yield Dir.find({ descendant: dir.dir_id }).sort({ depth: 1 });

      const conditions = { _id: descendantDirs.map( dir => dir.ancestor ) };
      const fields = { name: 1 };

      const files = yield File.find(conditions).select(fields);

      const sorted = descendantDirs.map( dir => files.filter( file => file.id == dir.ancestor )).reduce( (a,b) => a.concat(b));

      const findedDirs = [{ _id: dir._id, name: dir.name }].concat(sorted);

      const dirTree = findedDirs.map( (dir, idx, all) => {
        if (idx === 0) {
          return {
            ancestor: dir._id,
            descendant: dir._id,
            depth: idx
          };
        }
        else {
          return {
            ancestor: dir._id,
            descendant: all[0]._id,
            depth: idx
          };
        }
      });
      const savedDirs = yield Dir.collection.insert(dirTree);

      res.json({
        status: { success: true },
        body: savedDirs.dir
      });

    } catch (e) {
      let errors = {};

      switch (e) {
        case "name is duplication":
          errors.name = "既に同じ名前のフォルダが存在します";
          break;
        default:
          errors.unknown = e;
          break;
      }
      logger.error(errors);
      console.log(errors);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const move = (req, res, next) => {
  const moving_id = mongoose.Types.ObjectId(req.params.moving_id);
  const destination_id = mongoose.Types.ObjectId(req.body.destinationDir._id);

  Dir.find({
    depth: { $gt: 0 },
    $or: [
      { ancestor: moving_id },
      { descendant: moving_id }
    ]
  })
    .then( routes => {
      routes.forEach( route => route.remove() );
    })
    .then( () => {
      return Dir.find({ descendant: destination_id, depth: { $gt: 0 } });
    })
    .then( dirs => {
      return dirs.map( dir => {
        return {
          ancestor: dir.ancestor,
          descendant: moving_id,
          depth: dir.depth + 1
        };
      });
    })
    .then( dirs => {
      return dirs.concat({
        ancestor: destination_id,
        descendant: moving_id,
        depth: 1
      });
    })
    .then( dirs => {
      return Dir.collection.insert(dirs);
    })
    .then( () => {
      return File.findById(moving_id);
    })
    .then( _moving => {
      _moving.dir_id = destination_id;
      return _moving.save();
    })
    .then( _moving => {
      res.json({
        status: { success: true },
        body: _moving
      });
    })
    .catch( err => {
      console.log(err);
    });
};
