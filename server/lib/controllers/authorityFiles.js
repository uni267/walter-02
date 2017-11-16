import mongoose from "mongoose";
import co from "co";
import morgan from "morgan";
import logger from "../logger";

import * as constants from "../../configs/constants";

import AuthorityFile from "../models/AuthorityFile";
import Role from "../models/RoleFile";
import Action from "../models/Action";

export const files = (req, res, next) => {
  co(function* () {
    try {

      const user_id = res.user._id;

      if(req.body.files === undefined) throw "files is undefined";
      const files = req.body.files.map(id => mongoose.Types.ObjectId(id));

      const condition = {
        users: mongoose.Types.ObjectId(user_id),
        files: {$in: files}
      };

      const actions = yield AuthorityFile.getActions(condition);

      res.json({
        status: { success: true },
        body: actions
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
