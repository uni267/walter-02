import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import Action from "../models/Action";

const router = Router();

// 一覧
router.get("/", (req, res,next) => {
  co(function* () {
    try {
      const actions = yield Action.find();

      res.json({
        status: { success: true },
        body: actions
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
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
