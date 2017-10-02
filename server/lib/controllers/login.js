import co from "co";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECURITY_CONF } from "../../configs/server";
import User from "../models/User";
import Tenant from "../models/Tenant";

export const authentication = (req, res, next) => {
  co(function* () {
    try {
      const { email, password } = req.body;

      if (email === undefined ||
          email === null ||
          email === "") throw "email is empty";

      const user = yield User.findOne({ email });

      if (user === null) throw "user is empty";

      const hash = crypto.createHash("sha512").update(password).digest("hex");

      if (user.password !== hash) throw "password is invalid";

      const tenant = yield Tenant.findOne(user.tenant_id);

      const _user = { ...user.toObject(), tenant };

      const { secretKey } = SECURITY_CONF.development;
      const token = jwt.sign(_user, secretKey, { expiresIn: "7d" });

      res.json({
        status: { success: true },
        body: { token, user: _user }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "email is empty":
        errors.name = "ユーザ名が空です";
        break;
      case "user is empty":
        errors.name = "ユーザが存在しません";
        break;
      case "password is invalid":
        errors.password = "パスワードに誤りがあります";
        break;
      default:
        console.log(e);
        errors.unknown = e;
        break;
      }
      res.status(400).json({
        status: { success: false, errors }
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
