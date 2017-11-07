import mongoose from "mongoose";
import co from "co";
import moment from "moment";

// models
import User from "../models/User";

// constants
import * as constants from "../../configs/constants";

// etc
import { isEmpty } from "lodash";
import { logger } from "../index";
import {
  ValidationError,
  RecordNotFoundException,
  PermittionDeniedException
} from "../errors/AppError";

const { ObjectId } = mongoose.Types;

export const index = (req, res, next) => {
  co(function*(){
    try {

      const { tenant_id } = res.user;

      const informations = yield User.aggregate([
        { $match: { tenant_id: tenant_id }},
        { $project: {
          informations:1
        }}
      ]);

      res.json({
        status: { success: true },
        body: informations
      });

    } catch (e) {
      let errors = {};
      switch (e) {
      default:
        errors.unknown = e;
      }
      logger.error(errors);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const view = (req, res, next) => {
  co(function*(){
    try {

      const { user_id } = req.params;

      const informations = yield User.aggregate([
        { $match: { _id: ObjectId( user_id ) }},
        { $project: {
          informations:1,
          _id: 0
        }},
        {
          $unwind: {
            path: "$informations"
          }
        },
        { $sort:{
          "informations.created":-1
        }}
        , { '$limit': constants.INFOMATION_LIMITS_PER_PAGE }
      ]);

      res.json({
        status: { success: true },
        body: informations
      });

    } catch (e) {
      let errors = {};
      switch (e) {
      default:
        errors.unknown = e;
      }
      logger.error(errors);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const add = (req, res, next) => {
  co(function*(){
    try {

      const { title, body, users  } = req.body.informations;

      if(title === undefined || title === null || title === "") throw new ValidationError("title is empty");
      if(body === undefined || body === null || body === "") throw new ValidationError("body is empty");
      if(users === undefined || users === null  || isEmpty(users)) throw  new ValidationError("users is empty");

      const created = moment().format("YYYY-MM-DD HH:mm:ss");

      const information = {
        _id: new ObjectId(),
        title: title,
        body: body,
        created: created,
        read: false
      };

      const user_ids = users.map(user_id => ObjectId(user_id) );
      const user = yield User.find({ _id:{$in: user_ids }});
      if(isEmpty(user)) throw new RecordNotFoundException("user is not find");

      const changedUser = yield user.map(user => {
        user.informations = [
          ...user.informations,
          information
        ];
        return user.save();
      });

      res.json({
        status: { success: true },
        body: changedUser
      });

    } catch (e) {
      let errors = {};
      switch (e.message) {
        case "title is empty":
          errors.title = "タイトルが空のためお知らせの登録に失敗しました";
          break;
        case "body is empty":
          errors.body  = "本文が空のためお知らせの登録に失敗しました";
          break;
        case "users is empty":
          errors.users = "ユーザーが空のためお知らせの登録に失敗しました";
          break;
        case "user is not find":
          errors.user = "ユーザーが存在しないためお知らせの登録に失敗しました";
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
};