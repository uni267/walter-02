import co from "co";
import { Types } from "mongoose";

import DisplayItem from "../models/DisplayItem";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const items = yield DisplayItem.find({
        is_display: true,
        tenant_id: Types.ObjectId(res.user.tenant_id)
      }).sort({order: 1});

      res.json({
        status: { success: true },
        body: items
      });

    }
    catch (e) {
      res.status(400).json();
    }
  });
};

export const excel = (req, res, next) => {
  co(function* () {
    try {
      const body = yield DisplayItem.find({
        is_excel: true,
        tenant_id: Types.ObjectId(res.user.tenant_id)
      }).sort({ order: 1 });

      res.json({ status: { success: true }, body });
    }
    catch (e) {
      res.status(400).json();
    }
  });
};
