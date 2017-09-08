import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import Role from "../models/Role";
import Action from "../models/Action";

const router = Router();

// 一覧
router.get("/", (req, res, next) => {
  co(function* () {
    try {
      
      const tenant_id = mongoose.Types.ObjectId(req.query.tenant_id);
      const roles = yield Role.aggregate([
        {
          $match: {
            tenant_id: tenant_id
          }
        },
        {
          $lookup: {
            from: "actions",
            localField: "actions",
            foreignField: "_id",
            as: "actions"
          }
        }
      ]);

      res.json({
        status: { success: true },
        body: roles
      });
    }
    catch (e) {
      let errors = {};

      errors = e;
      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
});

// 詳細
router.get("/:role_id", (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const role = yield Role.findById(role_id);
      if (role === null || role === undefined) throw "role is not found";

      const actions = yield Action.find({ _id: { $in: role.actions } });
      const _role = role.toObject();
      _role.actions = actions;

      res.json({
        status: { success: true },
        body: _role
      });
    }
    catch (e) {
      let errors = {};
      errors = e;

      res.status(400).json({
        status: { success: false, errors }
      });
    }
    
  });
});

// 名前変更
router.patch("/:role_id/name", (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const { name } = req.body;
      if (name === undefined || name === null || name === "") throw "name is empty";

      const role = yield Role.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.name = name;
      const changedRole = yield role.save();

      res.json({
        status: { success: true },
        body: changedRole
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "name is empty":
        errors.name = "名称が空のため変更に失敗しました";
        break;
      case "role is not found":
        errors.role = "指定されたロールが見つからないため変更に失敗しました";
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
});

// 備考変更
router.patch("/:role_id/description", (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const { description } = req.body;

      const role = yield Role.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.description = description;
      const changedRole = yield role.save();

      res.json({
        status: { success: true },
        body: changedRole
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "role is not found":
        errors.role = "指定されたロールが見つからないため変更に失敗しました";
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
});

// action削除
router.delete("/:role_id/actions/:action_id", (req, res, next) => {
  co(function* () {
    try {
      const { role_id, action_id } = req.params;
      const [ role, action ] = yield [
        Role.findById(role_id),
        Action.findById(action_id)
      ];

      if (role === null) throw "role is empty";
      if (action === null) throw "action is empty";

      role.actions = role.actions.filter( _action => {
        return _action.toString() !== action._id.toString();
      });

      const changedRole = yield role.save();

      res.json({
        status: { success: true },
        body: changedRole
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "role is empty":
        errors.role = "指定されたロールが存在しないため削除に失敗しました";
        break;
      case "action is empty":
        errors.action = "指定されたアクションが存在しないため削除に失敗しました";
        break;
      default:
        errors.unknown = e;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
});

export default router;
