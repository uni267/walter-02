import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.all("*", (req, res, next) => {

  // @todo json web tokenを検証する!!
  if (!req.headers["x-auth-cloud-storage"]) {
    res.status(401);
    res.json({
      status: { success: false, message: "ログインして下さい" },
      body: {}
    });
  } else {
    next();
  }
});

export default router;
