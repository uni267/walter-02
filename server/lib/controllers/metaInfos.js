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
        tenant_id: tenant._id
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

      if (metainfo.label === undefined ||
          metainfo.label === null ||
          metainfo.label === "") throw "label is empty";

      if (metainfo.value_type === undefined ||
          metainfo.value_type === null ||
          metainfo.value_type === "") throw "value_type is empty";

      metainfo.tenant_id = tenant_id;

      let _metainfo = yield MetaInfo.findOne({ label: metainfo.label });
      if(_metainfo !== null) throw "label is duplicate";
     
      const createdMetainfo = yield metainfo.save();

      res.json({
        status: { success: true},
        body: createdMetainfo
      });      
    }catch(err){
      let errors = {};
      switch (err) {
        case "label is empty":
          errors.label = "表示名が空です";
          break;
        case "label is duplicate":
          errors.label = "既に同名の値が存在します";
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
      if(metainfo.tenant_id.toString() !== tenant_id.toString() ) throw "tenant_id is diffrent";

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

export const updateLabel = (req, res, next) => {
  co(function* (){
    try{
      const { tenant_id } = res.user;
      const { metainfo_id } =req.params;
      const { label } = req.body;

      if (label === null ||
          label === undefined ||
          label === "") throw "label is empty";

      const metainfo = yield MetaInfo.findById(metainfo_id);
      if(metainfo === null) throw "metainfo not found";
      if(metainfo.tenant_id.toString() !== tenant_id.toString() ) throw "tenant_id is diffrent";

      metainfo.label = label;
      const changedMetainfo = yield metainfo.save();

      res.json({
        status: { success: true},
        body: changedMetainfo
      });

    }
    catch(err) {
      let errors = {};

      switch(err){
        case "label is empty":
          errors.label = err;
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
