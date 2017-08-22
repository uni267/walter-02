import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { Router } from "express";
import File from "../models/File";
import Tag from "../models/Tag";

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
router.patch("/:file_id", (req, res, next) => {
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

