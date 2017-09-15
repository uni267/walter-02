import { Router } from "express";
import co from "co";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECURITY_CONF } from "../../configs/server";
import User from "../models/User";
import Tenant from "../models/Tenant";

const router = Router();

router.post("/", (req, res, next) => {
  co(function* () {
    try {
      const { email, password } = req.body;

      if (email === undefined ||
          email === null ||
          email === "") throw "email is empty";

      const user = yield User.findOne({ email });

      if (user === null) throw "user is empty";

      const sha = crypto.createHash("sha512");
      sha.update(password);
      const hash = sha.digest("hex");

      if (user.password !== hash) throw "password is invalid";

      const { secretKey } = SECURITY_CONF.development;
      const token = jwt.sign(user, secretKey, { expiresIn: "7d" });

      const tenant = yield Tenant.findOne(user.tenant_id);

      res.json({
        status: { success: true },
        body: {
          token,
          user: {...user.toObject(), tenant: tenant.toObject() }
        }
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
});

export default router;
