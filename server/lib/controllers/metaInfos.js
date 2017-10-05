import mongoose from "mongoose";
import co from "co";

import MetaInfo from "../models/MetaInfo";
import Tenant from "../models/Tenant";

const KEY_TYPE_META = "meta";

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
        key_type: KEY_TYPE_META
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

      const metainfo = new MetaInfo(req.body.metainfo);

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

      metainfo.key_type = KEY_TYPE_META;
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
          errors.key = "key名が空です";
          break;
        case "key is duplicate":
          errors.key = "既に同名の値が存在します";
          break;
        case "value_type is empty":
          errors.value_type = "型が空です";
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

export const view = (req, res, next) => {
  co(function* () {
    try{
      const { tenant_id } = res.user;
      const { metainfo_id } = req.params;
      if (metainfo_id === undefined ||
        metainfo_id === null ||
        metainfo_id === ""
      ) throw "metainfo_id is empty";

      const metainfo = yield MetaInfo.findById(metainfo_id);
      if (metainfo == null) throw "metainfo is empty";
      if(metainfo.tenant_id.toString() !== tenant_id.toString() ) throw "tenant_id is diffrent"

      res.json({
        status: { success: true},
        body: {
          ...metainfo.toObject()
        }
      });

    }
    catch(err){
      let errors = {};

      switch (err) {
        case "metainfo_id is empty":
          errors.metainfo_id = err;
          break;
        case "metainfo is empty":
          errors.metainfo = err;
          break;
        default:
          errors.unknown = err;
          break;
      }

      res.status(400).json({
        status: { success: false,errors}
      });
    }
  });
}

export const updateKey = (req, res, next) => {
  co(function* (){
    try{
      const { tenant_id } = res.user;
      const { metainfo_id } =req.params;
      const { key } = req.body;

      if (key === null ||
          key === undefined ||
          key === "") throw "key is empty"; 

      const metainfo = yield MetaInfo.findById(metainfo_id);
      if(metainfo === null) throw "metainfo not found";
      if(metainfo.tenant_id.toString() !== tenant_id.toString() ) throw "tenant_id is diffrent";
      if(metainfo.key_type !== KEY_TYPE_META ) throw "key_type is diffrent";

      metainfo.key = key;
      const changedMetainfo = yield metainfo.save();

      res.json({
        status: { success: true},
        body: changedMetainfo
      });

    }
    catch(err) {
      let errors = {};

      switch(err){
        case "key is empty":
          errors.key = err;
          break;
        default:
          errors.unknown = err;
          break;
      }

      res.status(400).json({
        status: {success: false, errors}
      });
    }
  });
}


export const valueType = (req, res, next) => {
  res.json({
    status: {
      seccusee: true,
      value_type: [
        {name: "String"},
        {name: "Number"},
        {name: "Date"}
      ]
    }
  });
}