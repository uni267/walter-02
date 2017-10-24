import mongoose from "mongoose";
import co from "co";
import morgan from "morgan";
import { logger } from "../index"

import * as constants from "../../configs/constants";

import Authority from "../models/Authority";
import Role from "../models/Role";
import Action from "../models/Action";

export const files = (req, res, next) => {
  co(function* () {
    try {

      const user_id = res.user._id;

      if(req.body.files === undefined) throw "files is undefined";
      const files = req.body.files.map(id => mongoose.Types.ObjectId(id))

      const condition = {
        users: [user_id],
        files: {$in: files}
      }

      const authorities = yield Authority.aggregate([
        { $match:condition },
        {
          $lookup:{
            from: "roles",
            localField: "roles",
            foreignField: "_id",
            as: "roles"
          }
        }
      ]);

      let actions = [];
      authorities.map(authority => {
          actions = [...actions,...authority.roles[0].actions];
      });

      const findedActions = yield Action.find({ _id:{$in: actions } });

      res.json({
        status: { success: true },
        actions: findedActions
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