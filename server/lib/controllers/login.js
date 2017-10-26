import co from "co";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import util from "util";
import * as commons from "./commons";
import { SECURITY_CONF } from "../../configs/server";
import User from "../models/User";
import Tenant from "../models/Tenant";

export const authentication = (req, res, next) => {
  co(function* () {
    try {
      const { account_name, password } = req.body;

      if (account_name === undefined ||
          account_name === null ||
          account_name === "") throw "account_name is empty";

      const user = yield User.findOne({ account_name });

      if (user === null) throw "user is empty";

      const hash = crypto.createHash("sha512").update(password).digest("hex");

      if (user.password !== hash) throw "password is invalid";

      const tenant = yield Tenant.findOne(user.tenant_id);

      const _user = { ...user.toObject(), tenant };
      delete _user.password;

      const { secretKey, expiresIn } = SECURITY_CONF.development;
      const token = jwt.sign(_user, secretKey, { expiresIn });

      res.json({
        status: { success: true, message: "ログインに成功しました" },
        body: { token, user: _user }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "account_name is empty":
        errors.account_name = "ユーザ名が空です";
        break;
      case "user is empty":
        errors.account_name = "ユーザが存在しません";
        break;
      case "password is invalid":
        errors.password = "パスワードに誤りがあります";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }
      res.status(400).json({
        status: {
          success: false,
          message: "ログインに失敗しました",
          errors
        }
      });
    }
  });
};

export const verifyToken = (req, res, next) => {
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
      const { token } = req.body;
      const decoded = yield verifyPromise(token);
      res.json({
        status: { status: "success" },
        body: { user: decoded }
      });
    }
    catch (e) {
    }
  });
};
