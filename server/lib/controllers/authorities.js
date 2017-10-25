import mongoose from "mongoose";
import co from "co";
import morgan from "morgan";
import { logger } from "../index"

import * as constants from "../../configs/constants";

import Authority from "../models/Authority";
import Role from "../models/Role";
import Action from "../models/Action";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const user_id = res.user._id;
      const condition = { users: mongoose.Types.ObjectId(user_id) }

      const actions = yield Authority.getActions(condition)

      res.json({
        status: { success: true },
        actions: actions
      });

    } catch (e) {
      let errors = {};
      switch (e) {
        // case "files is undefined":
        //   errors.files = "ファイルが指定されていません";
        // break;
      default:
        errors.unknown = e;
      }
      logger.error(errors);
      res.status(400).json({
        status: { success: false, errors }
      });

    }
  })
}


export const files = (req, res, next) => {
  co(function* () {
    try {

      const user_id = res.user._id;

      if(req.body.files === undefined) throw "files is undefined";
      const files = req.body.files.map(id => mongoose.Types.ObjectId(id))

      const condition = {
        users: mongoose.Types.ObjectId(user_id),
        files: {$in: files}
      }

      const actions = yield Authority.getActions(condition);

      res.json({
        status: { success: true },
        actions: actions
      });

    } catch (e) {
      let errors = {};
      switch (e) {
        case "files is undefined":
          errors.files = "ファイルが指定されていません";
        break;
      default:
        errors.unknown = e;
      }
      logger.error(errors);
      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
}