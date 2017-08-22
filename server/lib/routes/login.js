import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECURITY_CONF } from "../../configs/server";
import User from "../models/User";

const router = Router();

router.post("/", (req, res, next) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (user === null) {
      res.status(401);
      res.json({
        status: {
          success: false,
          message: "認証に失敗しました",
          errors: { name: "ユーザが存在しません" }
        },
        body: {}
      });
      return;
    }

    const sha = crypto.createHash("sha512");
    sha.update(req.body.password);
    const hash = sha.digest("hex");

    if (user.password === hash) {

      const { secretKey } = SECURITY_CONF.development;
      const token = jwt.sign(user, secretKey, { expiresIn: "24h" });
                              
      res.json({
        status: { success: true, message: "ログインに成功しました" },
        token: token,
        body: { user_id: user._id }
      });

    } else {
      res.status(401).json({
        status: {
          success: false,
          message: "認証に失敗しました",
          errors: { password: "パスワードに誤りがあります" }
        },
        body: {}
      });
    }

  });

});

export default router;
