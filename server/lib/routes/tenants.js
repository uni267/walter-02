import { Router } from "express";
import mongoose from "mongoose";

import { TenantSchema } from "../models";
import { SERVER_CONF } from "../../configs/server";

const router = Router();

mongoose.models = {};
mongoose.modelSchemas = {};
const Tenant = mongoose.model("tenants", TenantSchema);

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
