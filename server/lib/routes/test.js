import { Router } from "express";
import mongoose, { Schema } from "mongoose";
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

export default router;
