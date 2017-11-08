import mongoose from "mongoose";
import co from "co";
import moment from "moment";

// models
import User from "../models/User";

// constants
import * as constants from "../../configs/constants";

// etc
import { isEmpty,first } from "lodash";
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

      const notifications = yield User.aggregate([
        { $match: { tenant_id: tenant_id }},
        { $project: {
          notifications:1
        }}
      ]);

      res.json({
        status: { success: true },
        body: notifications
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
      let { page } = req.query;

      if(page === undefined || page === null || page === "") page = 0;
      const offset = page * constants.INFOMATION_LIMITS_PER_PAGE;

      const notifications = yield User.aggregate([
        { $match: { _id: ObjectId( user_id ) }},
        { $project: {
          notifications:1,
          _id: 0
        }},
        {
          $unwind: {
            path: "$notifications"
          }
        },
        { $sort:{
          "notifications.created":-1
        }},
        { '$skip':offset },
        { '$limit': constants.INFOMATION_LIMITS_PER_PAGE }
      ]);

      res.json({
        status: { success: true },
        body: notifications
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

      const { title, body, users  } = req.body.notifications;

      if(title === undefined || title === null || title === "") throw new ValidationError("title is empty");
      if(body === undefined || body === null || body === "") throw new ValidationError("body is empty");
      if(users === undefined || users === null  || isEmpty(users)) throw  new ValidationError("users is empty");

      const created = moment().format("YYYY-MM-DD HH:mm:ss");

      const notification = {
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
        user.notifications = [
          ...user.notifications,
          notification
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

export const getCount = (req, res, next) => {
  co(function*(){
    try{

      const { user_id } = req.params;
      if( user_id === undefined || user_id === null || user_id === "" ) throw new RecordNotFoundException("user_id is empty");

      const notifications = yield User.aggregate([
        { $match: { _id: ObjectId( user_id ) }},
        { $project: {
          notifications:1,
          _id: 0
        }},
        {
          $unwind: {
            path: "$notifications"
          }
        }
      ]);

      const unread = notifications.filter(notification =>{
        return (notification.notifications.read === undefined || notification.notifications.read === false);
      });

      res.json({
        status: {
          success: true,
          total:notifications.length,
          unread: unread.length
        },
      });
    } catch (e) {
      let errors = {};
      switch (e.message) {
        case "user_id is empty":
          errors.user_id = "ユーザーIDが空のためお知らせの件数を取得できませんでした。";
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

export const toggleRead = (req, res, next) => {
  co(function*(){
    try {

      const { user_id } = req.params;
      const notifications = req.body.notifications;

      const user = yield User.findById(user_id);

      const newNotifications = user.notifications.map( notification => {
        let retNotification = notification;
        if(notifications.includes( notification._id.toString() )){
          retNotification.read = !notification.read;
        }
        return retNotification;
      });

      user.notifications = newNotifications;

      const changedUser = yield user.save();

      res.json({
        status: {
          success: true
        },
        body: changedUser
      });
    } catch (e) {
      let errors = {};
      switch (e.message) {
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