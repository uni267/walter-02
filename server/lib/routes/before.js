import { Router } from "express";
import co from "co";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { SECURITY_CONF } from "../../configs/server";

const router = Router();

router.all("*", (req, res, next) => {
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
      const user = yield User.findById(decoded._doc._id);

      if (user === null) throw "user is empty";

      res.user = user;
      next();
    }
    // @todo jwt.verifyのエラーを調査する
    catch (e) {
      let errors = {};

      switch (e) {
      case "token is empty":
        errors.token = e;
        break;
      case "user is empty":
        errors.user = e;
        break;
      default:
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
