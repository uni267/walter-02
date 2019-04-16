import _ from "lodash";

import Action from "../models/Action";
import AppSetting from "../models/AppSetting";

export const index = async (req, res, next) => {
  try {
    let actions = await Action.find();

    const timestampPerm = await AppSetting.findOne({ tenant_id: res.user.tenant_id, name: AppSetting.TIMESTAMP_PERMISSION })
    if (!timestampPerm || !timestampPerm.enable) {
      actions = _.reject(actions, ({ name }) => name === "auto-timestamp" || name === "verify-timestamp" || name === "add-timestamp")
    }

    res.json({
      status: { success: true },
      body: actions
    });
  }
  catch (e) {
    let errors = {};

    switch (e) {
    default:
      errors.unknown = e;
      break;
    }

    res.status(400).json({
      status: { success: false, errors }
    });
  }
};
