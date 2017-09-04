import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECURITY_CONF } from "../../configs/server";
import User from "../models/User";
import Tenant from "../models/Tenant";

const router = Router();

router.post("/", (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then( user => {
      if (user === null) throw "user not found";
      return user;
    })
    .then( user => {

      const sha = crypto.createHash("sha512");
      sha.update(req.body.password);
      const hash = sha.digest("hex");

      if (user.password !== hash) throw "password is invalid";

      const { secretKey } = SECURITY_CONF.development;
      const token = jwt.sign(user, secretKey, { expiresIn: "24h" });

      res.token = token;
      return user;
    })
    .then( user => {
      res.user = user.toObject();

      return Tenant.findOne(user.tenant_id);
    })
    .then( tenant => {
      res.user.tenant = tenant;

      res.json({
        status: { success: true, message: "ログインに成功しました" },
        body: {
          token: res.token,
          user: res.user
        }
      });
    })
    .catch( err => {
      let errors;

      switch ( err ) {
      case "user not found":
        errors = { name: "ユーザが存在しません" };
        break;
      case "password is invalid":
        errors = { password: "パスワードに誤りがあります" };
        break;
      default:
        errors = err;
        break;
      }

      res.status(400).json({
        status: {
          success: false,
          message: "認証に失敗しました",
          errors: errors
        }
      });
    });
});

export default router;
