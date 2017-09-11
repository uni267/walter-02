import mongoose from "mongoose";
import co from "co";
import jwt from "jsonwebtoken";
import multer from "multer";
import moment from "moment";

import { Router } from "express";
import File from "../models/File";
import Tag from "../models/Tag";
import MetaInfo from "../models/MetaInfo";

import { SECURITY_CONF } from "../../configs/server";

const router = Router();

// ファイル一覧
router.get("/", (req, res, next) => {
  co(function* () {
    try {
      const { dir_id } = req.query;

      if (dir_id === null ||
          dir_id === undefined ||
          dir_id === "") throw "dir_id is empty";

      const conditions = {
        dir_id: mongoose.Types.ObjectId(dir_id)
      };

      const files = yield File.aggregate([
        { $match: conditions },
        { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
      ]);

      res.json({
        status: { success: true },
        body: files
      });
    }
    catch (e) {
      let errors = {};
      switch (e) {
      case "dir_id is empty":
        errors.dir_id = "dir_id is empty";
        break;
      default:
        errors.unknown = e;
      }

      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
});

// ファイル検索
router.get("/search", (req, res, next) => {
  co(function* () {
    try {
      const conditions = {
        name: { $regex: req.query.q },
        is_display: true
      };

      const files = yield File.aggregate([
        { $match: conditions },
        { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
      ]);

      res.json({
        status: { success: true },
        body: files
      });
    }
    catch (e) {
      res.json({
        status: { success: false, message: "ファイルの取得に失敗", errors: e },
        body: []
      });
    }
  });
});

// ファイル詳細
router.get("/:file_id", (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const file = yield File.findById(file_id);
      const tags = yield Tag.find({ _id: { $in: file.tags } });

      res.json({
        status: { success: true },
        body: { ...file.toObject(), tags }
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = "file_id is empty";
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
});

// ファイル名変更
router.patch("/:file_id/rename", (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      const changedFileName = req.body.name;

      if (file_id === null ||
          file_id === undefined ||
          file_id === "") throw "file_id is empty";

      if (changedFileName === null ||
          changedFileName === undefined ||
          changedFileName === "") throw "name is empty";

      const file = yield File.findById(file_id);
      file.name = changedFileName;
      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      console.log(e);
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.fild_id = "file_id is empty";
        break;
      case "name is empty":
        errors.name = "ファイル名が空のため変更に失敗しました";
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
  file.meta_infos = [];

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

      const history = {
        modified: moment().format("YYYY-MM-DD hh:mm:ss"),
        user: user,
        action: "新規作成",
        body: ""
      };

      file.histories = file.histories.concat(history);
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
        status: {
          success: false,
          message: "ファイルのアップロードに失敗しました",
          errors: err },
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
      const [ file, tag ] = result;

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

// メタ情報の追加
router.post("/:file_id/meta", (req, res, next) => {
  const file_id = mongoose.Types.ObjectId(req.params.file_id);
  const { meta, value } = req.body;

  const tasks = [
    File.findById(file_id).then( file => file ),
    MetaInfo.findById(mongoose.Types.ObjectId(meta._id)).then( meta => meta)
  ];

  Promise.all(tasks)
    .then( result => {
      const [ _file, _meta ] = result;

      const pushMeta = {
        meta_info_id: _meta._id,
        key: _meta.key,
        value: value,
        value_type: _meta.value_type
      };

      _file.meta_infos = [..._file.meta_infos, pushMeta];
      return _file.save();
    })
    .then( _file => {
      res.json({
        status: { success: true },
        body: _file
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
});

// メタ情報の削除
router.delete("/:file_id/meta/:meta_id", (req, res, next) => {
  const file_id = mongoose.Types.ObjectId(req.params.file_id);
  const meta_id = mongoose.Types.ObjectId(req.params.meta_id);

  const tasks = [
    File.findById(file_id).then( file => file ),
    MetaInfo.findById(meta_id).then( meta => meta )
  ];

  Promise.all(tasks)
    .then( result => {
      const [ file, meta ] = result;

      if (file === null) throw "指定されたファイルがみつかりません";
      if (meta === null) throw "指定されたメタ情報がみつかりません";

      file.meta_infos = file.meta_infos.filter( _meta => {
        return _meta.meta_info_id.toString() !== meta._id.toString();
      });

      return file.save();
    })
    .then( file => {
      res.json({
        status: { success: true },
        body: file
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });

});

export default router;

