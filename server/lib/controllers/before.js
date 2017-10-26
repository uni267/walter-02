import co from "co";
import jwt from "jsonwebtoken";
import * as commons from "./commons";

// models
import User from "../models/User";
import Tenant from "../models/Tenant";

import { SECURITY_CONF } from "../../configs/server";

export const verifyToken = (req, res, next) => {
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
      const authHeader = req.headers["x-auth-cloud-storage"];
      if (authHeader === undefined ||
          authHeader === null ||
          authHeader === "") throw "token is empty";

      const decoded = yield verifyPromise(authHeader);
      const user = yield User.findById(decoded._id);
      if (user === null) throw "user is empty";

      const _user = user.toObject();
      _user.tenant = yield Tenant.findById(user.tenant_id);

      res.user = _user;
      next();
    }
    // @todo jwt.verifyのエラーを調査する
    catch (e) {
      
      let errors = {};

      switch (e) {
      case "token is empty":
        errors.token = "トークンが空のため検証に失敗";
        break;
      case "user is empty":
        errors.user = "トークンからユーザ情報を取得したが空のためエラー";
        break;
      default:
        if (e.message === "jwt malformed" && e.name === "JsonWebTokenError") {
          errors.token = "トークンの復号処理に失敗";
        } else {
          errors.unknown = commons.errorParser(e);
        }
        break;
      }

      res.status(400).json({
        status: { success: false, message: "トークンの検証に失敗", errors }
      });
    }
  });
};
