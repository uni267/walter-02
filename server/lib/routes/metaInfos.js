import mongoose from "mongoose";

import { Router } from "express";
import MetaInfo from "../models/MetaInfo";

const router = Router();

router.get("/", (req, res, next) => {
  const tenant_id = mongoose.Types.ObjectId(req.query.tenant_id);

  MetaInfo.find({ tenant_id: tenant_id })
    .then( meta => {
      res.json({
        status: { success: true },
        body: meta
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err}
      });
    });
});

export default router;
