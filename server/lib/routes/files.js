import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import moment from "moment";

import { Router } from "express";
import File from "../models/File";
import Tag from "../models/Tag";
import { SECURITY_CONF } from "../../configs/server";

const router = Router();

// ファイル一覧
router.get("/", (req, res, next) => {
  const conditions = Object.assign({}, req.query);

  conditions.dir_id = mongoose.Types.ObjectId(conditions.dir_id);

  File.aggregate([
    { $match: conditions },
    { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
  ])
    .then( files => {
      res.json({
        status: { success: true },
        body: files
      });
    })
    .catch( err => {
      res.json({
        status: { success: false, message: "エラー", errors: err },
        body: {}
      });
    });      

});

// ファイル検索
router.get("/search", (req, res, next) => {
  const { q } = req.query;
  const conditions = {
    name: { $regex: q },
    is_display: true
  };

  File.aggregate([
    { $match: conditions },
    { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
  ])
    .then( files => {
      res.json({
        status: { success: true },
        body: files
      });
    })
    .catch( err => {
      res.json({
        status: { success: false, message: "ファイルの取得に失敗", errors: err },
        body: []
      });
    });

});

// ファイル詳細
router.get("/:id", (req, res, next) => {
  const file_id = mongoose.Types.ObjectId(req.params.id);

  File.aggregate([
    { $match: { _id: file_id } },
    { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
  ])
    .then( files => {
      res.json({
        status: { success: true },
        body: files[0]
      });
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        status: { success: false, message: "ファイルの取得に失敗", errors: err }
      });
    });

});

// ファイル名変更
router.patch("/:file_id/rename", (req, res, next) => {
  const file_id = req.params.file_id;
  const changedFname = req.body.name;

  File.findById(file_id)
    .then( file => {
      file.name = changedFname;
      return file.save();
    })
    .then( file => {
      res.json({
        status: { success: true },
        body: file
      });
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        status: { success: false, message: "ファイル名の変更に失敗", errors: err },
        body: {}
      });
    });
  
});

// ファイル移動
router.patch("/:file_id/move", (req, res, next) => {
  const file_id = req.params.file_id;
  const dir_id = req.body.dir_id;

  File.findById(file_id)
    .then( file => {
      file.dir_id = dir_id;
      return file.save();
    })
    .then( file => {
      res.json({
        status: { success: true },
        body: file
      });
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        status: { success: false, message: "ファイルの移動に失敗", errors: err },
        body: {}
      });
    });

});

// ファイルアップロード
const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([ { name: "myFile" } ]), (req, res, next) => {
  const myFile = req.files.myFile[0];
  const dir_id = req.body.dir_id;

  const file = new File();
  file.name = myFile.originalname;
  file.blob_path = myFile.path;
  file.mime_type = myFile.mimetype;
  file.size = myFile.size;
  file.modified = moment().format("YYYY-MM-DD HH:mm:ss");
  file.is_dir = false;
  file.dir_id = dir_id;
  file.is_display = true;
  file.is_star = false;
  file.tags = [];
  file.histories = [];
  file.authorities = [];
  file.metaInfo = [];

  new Promise( (resolve, reject) => {
    const token = req.headers["x-auth-cloud-storage"];
    const { secretKey } = SECURITY_CONF.development;

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(decoded);
      }
    });

  })
    .then( decoded => {
      const user = decoded._doc;
      delete user.password;

      const authority = {
        user: user,
        role: { name: "full control", actions: [ "read", "write", "authority" ] }
      };

      file.authorities = file.authorities.concat(authority);
      return file.save();
    })
    .then( file => {
      res.json({
        status: { success: true, message: "ファイルをアップロードしました" },
        body: file
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err },
        body: {}
      });
    });

});
  

// タグの追加
router.post("/:file_id/tags", (req, res, next) => {

  const file_id = req.params.file_id;
  const tag_id = req.body._id;

  const tasks = [
    File.findById(file_id).then( file => file ),
    Tag.findById(tag_id).then( tag => tag )
  ];

  // 念のため渡されたタグIDのレコードが存在するかをチェックする
  Promise.all(tasks)
    .then( result => {
      const file = result[0];
      const tag = result[1];

      file.tags = file.tags.concat(tag._id);
      return file.save();
    })
    .then( updatedFile => {

      return File.aggregate([
        { $match: { _id: updatedFile._id } },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
          }
        }
      ]);

    })
    .then( files => {
      res.json({
        status: { success: true, message: "タグを追加しました" },
        body: files[0]
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, message: "タグの追加に失敗", errors: err },
        body: {}
      });
    });

});

// タグの削除
router.delete("/:file_id/tags/:tag_id", (req, res, next) => {

  const { file_id, tag_id } = req.params;

  const tasks = [
    File.findById(file_id).then( file => file ),
    Tag.findById(tag_id).then( tag => tag )
  ];

  Promise.all(tasks)
    .then( result => {
      const file = result[0];
      const tag = result[1];

      // ObjectIDを文字列にキャストし比較する
      file.tags = file.tags.filter( file_tag => file_tag.toString() !== tag.id );
      return file.save();
    })
    .then( updatedFile => {

      return File.aggregate([
        { $match: { _id: updatedFile._id } },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
          }
        }
      ]);
    })
    .then( files => {
      res.json({
        status: { success: true },
        body: files[0]
      });
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        status: { success: false, message: "タグの削除に失敗", errors: err },
        body: {}
      });
    });

});

export default router;

