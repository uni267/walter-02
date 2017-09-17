import co from "co";
import moment from "moment";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { SECURITY_CONF } from "../../configs/server";
import Dir from "../models/Dir";
import File from "../models/File";
import Tenant from "../models/Tenant";

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
          _id: root._id,
          name: root.name,
          children: children
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
  const { dir_id, dir_name } = req.body;

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

  // authoritiesを構築するためセッションからユーザ情報を抽出
  const { token } = req.body;
  const { secretKey } = SECURITY_CONF.development;

  const validationConditions = {
    name: dir_name,
    is_dir: true,
    dir_id: mongoose.Types.ObjectId(dir_id)
  };

  File.find(validationConditions)
    .then( files => {
      if (files.length > 0) throw "name is duplication";

      return new Promise( (resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });

    })
    .then( decoded => {
      const user = decoded._doc;
      delete user.password;

      const authority = {
        user: user,
        role: { name: "full control", actions: [ "read", "write", "authority" ] }
      };

      dir.authorities = dir.authorities.concat(authority);

      const history = {
        modified: moment().format("YYYY-MM-DD hh:mm:ss"),
        user: user,
        action: "新規作成",
        body: ""
      };

      dir.histories = dir.histories.concat(history);
      return dir.save();
    })
    .then( dir => {

      res.dir = dir;

      return Dir.find({ descendant: dir.dir_id })
        .sort({ depth: 1 }).then( dirs => {

          const conditions = { _id: dirs.map( dir => dir.ancestor ) };
          const fields = { name: 1 };

          return File.find(conditions).select(fields).then( files => {

            const sorted = dirs.map(
              dir => files.filter( file => file.id == dir.ancestor )
            ).reduce( (a, b) => a.concat(b) );

            return [{ _id: dir._id, name: dir.name }].concat(sorted);
          });

        });

    })
    .then( sorted => {
      return sorted.map( (dir, idx, all) => {
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
      
    })
    .then( dirs => {
      return Dir.collection.insert(dirs);
    })
    .then( dirs => {
      res.json({
        status: { success: true },
        body: res.dir
      });
    })
    .catch( err => {
      console.log(err);
      if (err === "name is duplication") {
        res.status(400).json({
          status: {
            success: false,
            message: "既に同じ名前のフォルダが存在します",
            errors: { dirName: "既に同じ名前のフォルダが存在します" }
          },
          body: {}
        });
      }
      else {
        res.status(500).json({
          status: {
            success: false,
            message: "exception",
            errors: err
          },
          body: {}
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
