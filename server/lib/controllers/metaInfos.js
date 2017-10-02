import mongoose from "mongoose";
import co from "co";

import MetaInfo from "../models/MetaInfo";
import Tenant from "../models/Tenant";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = res.user;
      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      const tenant = yield Tenant.findById(tenant_id);
      if (tenant === null) throw "tenant is empty";

      const conditions = {
        tenant_id: tenant._id,
        key_type: "meta"
      };

      const meta_infos = yield MetaInfo.find(conditions);

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
