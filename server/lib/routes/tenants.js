import { Router } from "express";
import mongoose from "mongoose";

import Tenant from "../models/Tenant";
const router = Router();

// view
router.get("/:id", (req, res, next) => {
  console.log(req.params.id);

  Tenant.findById(req.params.id, (err, tenant) => {
    if (tenant === undefined) {
      res.json({
        status: { success: true, message: "テナントが存在しません" },
        body: {}
      });
    }
  }).then(tenant => {
    res.json({
      status: { success: true },
      body: tenant
    });
  });
});

export default router;
