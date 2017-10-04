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

export const add = (req, res, next) => {
  co(function*() {
    try{

      const metainfo = new MetaInfo(req.body);

      const { tenant_id } = res.user;

      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      if (metainfo.key === undefined ||
          metainfo.key === null ||
          metainfo.key === "") throw "key is empty";

      if (metainfo.value_type === undefined ||
          metainfo.value_type === null ||
          metainfo.value_type === "") throw "value_type is empty";

      metainfo.key_type = "meta";
      metainfo.tenant_id = tenant_id;

      let _metainfo = yield MetaInfo.findOne({ key: metainfo.key });
      if(_metainfo !== null) throw "key is duplicate";
     
      const createdMetainfo = yield metainfo.save();

      res.json({
        status: { success: true},
        body: createdMetainfo
      });      
    }catch(err){
      let errors = {};
      switch (err) {
        case "key is empty":
          errors.name = "表示名が空です";
          break;
        case "key is duplicate":
          errors.name = "既に同名の値が存在します";
          break;
        case "value_type is empty":
          errors.name = "型が空です";
          break;
        default:
          errors = err;
          break;
      }
      res.status(400).json({
        status: { success: false, errors }
      });
    }

  });
}
