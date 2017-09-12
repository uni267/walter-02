import mongoose from "mongoose";
import co from "co";
import jwt from "jsonwebtoken";
import multer from "multer";
import moment from "moment";

import { Router } from "express";
import File from "../models/File";
import Tag from "../models/Tag";
import MetaInfo from "../models/MetaInfo";
import User from "../models/User";
import Tenant from "../models/Tenant";

import { SECURITY_CONF } from "../../configs/server";

const router = Router();

// ファイル一覧
router.get("/", (req, res, next) => {
  co(function* () {
    try {
      let { dir_id } = req.query;

      // デフォルトはテナントのホーム
      if (dir_id === null || dir_id === undefined || dir_id === "") {
        const tenant = yield Tenant.findById(res.user.tenant_id);
        dir_id = tenant.home_dir_id;
      }

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

// ファイル検索項目一覧
router.get("/search_items", (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = req.query;

      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      const meta_infos = yield MetaInfo.find({
        tenant_id: mongoose.Types.ObjectId(tenant_id)
      }).select({ key: 1, value_type: 1 });

      const base_items = [
        { _id: 1, key: "ファイル名", value_type: "String" },
        { _id: 2, key: "お気に入り", value_type: "Bool" },
        { _id: 3, key: "タグ", value_type: "String" },
        { _id: 4, key: "更新日時", value_type: "Date" }
      ];

      res.json({
        status: { success: true },
        body: [ ...base_items, ...meta_infos ]
      });
    }
    catch (e) {
      res.status(400).json({ e });
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
  co(function* () {
    try {
      const file_id = req.params.file_id;
      const dir_id = req.body.dir_id;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (dir_id === undefined ||
          dir_id === null ||
          file_id === "") throw "dir_id is empty";

      const [ file, dir ] = yield [ File.findById(file_id), File.findById(dir_id) ];

      if (file === null) throw "file is empty";
      if (dir === null) throw "dir is empty";

      file.dir_id = dir._id;
      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });
    }
    catch (e) {
      let errors = {};
      // @todo ちゃんとメッセージを実装する
      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "dir_id is empty":
        errors.dir_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "dir is empty":
        errors.dir = e;
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

// ファイルアップロード
const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([ { name: "myFile" } ]), (req, res, next) => {

  // jwt.vefifyはasyncかつpromiseを返却しない
  const verifyPromise = (token) => {
    return new Promise( (resolve, reject) => {
      const { secretKey } = SECURITY_CONF.development;

      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  };

  co(function* () {
    try {
      const myFile = req.files.myFile[0];
      const dir_id = req.body.dir_id;

      if (myFile === null ||
          myFile === undefined ||
          myFile === "") throw "myFile is empty";

      if (dir_id === null ||
          dir_id === undefined ||
          dir_id === "") throw "dir_id is empty";

      const dir = yield File.findById(dir_id);

      if (dir === null) throw "dir is empty";

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

      const decoded = yield verifyPromise(req.headers["x-auth-cloud-storage"]);
      const user = yield User.findById(decoded._doc._id);

      if (user === null) throw "user is empty";

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
      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "myFile is empty":
        errors.myFile = e;
        break;
      case "dir_id is empty":
        errors.dir_id = e;
        break;
      case "dir is empty":
        errors.dir = e;
        break;
      case "user is empty":
        errors.user = e;
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
  

// タグの追加
router.post("/:file_id/tags", (req, res, next) => {
  co(function* () {
    try {
      const file_id = req.params.file_id;
      const tag_id = req.body._id;
      if (file_id === null ||
          file_id === undefined ||
          file_id === "") throw "file_id is empty";

      if (tag_id === null ||
          tag_id === undefined ||
          tag_id === "") throw "tag_id is empty";

      const [ file, tag ] = yield [ File.findById(file_id), Tag.findById(tag_id)];

      if (file === null) throw "file is empty";
      if (tag === null) throw "tag is empty";

      file.tags = [ ...file.tags, tag._id ];
      const changedFile = yield file.save();

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
        errors.file_id = e;
        break;
      case "tag_id is empty":
        errors.tag_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "tag is empty":
        errors.tag = e;
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

// タグの削除
router.delete("/:file_id/tags/:tag_id", (req, res, next) => {
  co(function* () {
    try {
      const { file_id, tag_id } = req.params;    

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (tag_id === undefined ||
          tag_id === null ||
          tag_id === "") throw "tag_id is empty";

      const [ file, tag ] = yield [ File.findById(file_id), Tag.findById(tag_id) ];

      if (file === null) throw "file is empty";
      if (tag === null) throw "tag is empty";

      file.tags = file.tags.filter( file_tag => file_tag.toString() !== tag.id );
      const changedFile = yield file.save();

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
        errors.file_id = e;
        break;
      case "tag_id is empty":
        errors.tag_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "tag is empty":
        errors.tag = e;
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

// メタ情報の追加
router.post("/:file_id/meta", (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const { meta, value } = req.body;

      if (meta._id === undefined) throw "meta is empty";

      if (value === undefined ||
          value === null ||
          value === "") throw "value is empty";

      const [ file, metaInfo ] = yield [
        File.findById(file_id),
        MetaInfo.findById(meta._id)
      ];

      if (file === null) throw "file is empty";
      if (metaInfo === null) throw "metaInfo is empty";

      const pushMeta = {
        meta_info_id: metaInfo._id,
        key: metaInfo.key,
        value: value,
        value_type: metaInfo.value_type
      };

      file.meta_infos = [ ...file.meta_infos, pushMeta ];

      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "meta is empty":
        errors.meta = e;
        break;
      case "value is empty":
        errors.value = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "metaInfo is empty":
        errors.metaInfo = e;
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

// メタ情報の削除
router.delete("/:file_id/meta/:meta_id", (req, res, next) => {
  co(function* () {
    try {
      const { file_id, meta_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (meta_id === undefined ||
          meta_id === null ||
          meta_id === "") throw "meta_id is empty";

      const [ file, metaInfo ] = yield [
        File.findById(file_id),
        MetaInfo.findById(meta_id)
      ];

      if (file === null) throw "file is empty";
      if (metaInfo === null) throw "metaInfo is empty";

      file.meta_infos = file.meta_infos.filter( _meta => {
        return _meta.meta_info_id.toString() !== metaInfo._id.toString();
      });

      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "meta_id is empty":
        errors.meta_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "metaInfo is empty":
        errors.metaInfo = e;
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

export default router;

