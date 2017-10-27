import mongoose from "mongoose";
import co from "co";
import RoleMenu from "../models/RoleMenu";
import Menu from "../models/Menu";

const { ObjectId } = mongoose.Types;

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = res.user;

      const roles = yield RoleMenu.aggregate([
        { $match:{ tenant_id: ObjectId(tenant_id)}},
        { $lookup:{
            from: "menus",
            localField: "menus",
            foreignField: "_id",
            as: "menus"
        }}
      ])

      res.json({
        status: { success: true },
        body: roles
      });
    } catch (e) {
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
  });
}