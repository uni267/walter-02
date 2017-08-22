import { Router } from "express";
import moment from "moment";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { SECURITY_CONF } from "../../configs/server";
import Dir from "../models/Dir";
import File from "../models/File";

const router = Router();

// ディレクトリの階層
router.get("/", (req, res, next) => {
  const conditions = {
    descendant: req.query.dir_id
  };

  Dir.find(conditions).sort({depth: -1}).then( dirs => {
    const conditions = { _id: dirs.map( dir => dir.ancestor ) };
    const fields = { name: 1 };

    return File.find(conditions).select(fields).then( files => {

      const sorted = dirs.map( dir => {
        return files.filter( file => file.id == dir.ancestor );
      }).reduce( (a, b) => a.concat(b));

      const withSep = [].concat.apply([], sorted.map( (dir, idx) => {
        return (idx === 0) ? dir : ["sep", dir];
      }));

      return withSep;

    });
  })
    .then( withSep => {
      res.json({
        status: { success: true },
        body: withSep
      });
    })
    .catch( err => {

    res.json({
      status: { success: false, errors: err },
      body: []
    });

  });

});

router.post("/", (req, res, next) => {
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
      // dirはここで完成
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

});

export default router;
