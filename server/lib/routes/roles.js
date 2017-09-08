import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import Role from "../models/Role";
const router = Router();

router.get("/", (req, res, next) => {
  co(function* () {
    try {
      
      const tenant_id = mongoose.Types.ObjectId(req.query.tenant_id);
      const roles = yield Role.find({ tenant_id: tenant_id });

      res.json({
        status: { success: true },
        body: roles
      });
    }
    catch (e) {
      let errors = {};

      errors = e;
      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
});

export default router;
