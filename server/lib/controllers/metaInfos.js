import mongoose from "mongoose";
import co from "co";

import MetaInfo from "../models/MetaInfo";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = req.query;
      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      const meta_infos = yield MetaInfo.find({
        tenant_id: mongoose.Types.ObjectId(tenant_id)
      });

      res.json({
        status: { success: true },
        body: meta_infos
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "tenant_id is empty":
        errors.tenant_id = e;
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
};
