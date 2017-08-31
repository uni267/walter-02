import { Router } from "express";
import mongoose from "mongoose";
import Group from "../models/Group";

const router = Router();

router.get("/", (req, res, next) => {
  // @todo tenant_idのnullable validation
  Group.find({ tenant_id: mongoose.Types.ObjectId(req.query.tenant_id) })
    .then( groups => {
      res.json({
        status: { success: true },
        body: groups
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
});

export default router;
