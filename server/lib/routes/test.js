import { Router } from "express";
import mongoose, { Schema } from "mongoose";
import multer from "multer";
import morgan from "morgan";

import Test from "../models/Test";
const router = Router();

router.get("/", (req, res, next) => {
  res.json(Test.test_method());

  // mongoose join exmaple
  // File.aggregate([
  //   { $match: { _id: mongoose.Types.ObjectId("59952d5d9970861eee9c743c") } },
  //   { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } }
  // ])
  //   .then( file_tags => {
  //     res.json(file_tags);
  //   })
  //   .catch( err => res.status(500).json(err));
});

const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([ { name: "myFile" } ]), (req, res, next) => {
  const myFile = req.files.myFile[0];
  const dir_id = req.body.dir_id;
  console.log(myFile, dir_id);
  res.json(myFile);
});

export default router;
