import mongoose from "mongoose";
import co from "co";
import RoleFile from "../models/RoleFile";
import Action from "../models/Action";
import * as commons from "./commons";

const { ObjectId } = mongoose.Types;

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = res.user;
      const roles = yield RoleFile.aggregate([
        {
          $match: {
            tenant_id: ObjectId(tenant_id)
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
};

export const create = (req, res, next) => {
  co(function* () {
    try {
      const { role } = req.body;

      if (role.name === undefined ||
          role.name === null ||
          role.name === "") throw "name is empty";

      const _role = yield RoleFile.findOne({
        name: role.name,
        tenant_id: res.user.tenant_id
      });

      if ( _role !== null ) throw "name is duplicate";

      const newRoleFile = new RoleFile();
      newRoleFile.name = role.name;
      newRoleFile.description = role.description;
      newRoleFile.tenant_id = res.user.tenant_id;

      const createdRoleFile = yield newRoleFile.save();

      res.json({
        status: { success: true },
        body: createdRoleFile
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "name is empty":
        errors.name = "ロール名が空のため作成に失敗しました";
        break;
      case "name is duplicate":
        errors.name = "同名のロールが既に存在するため作成に失敗しました";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const view = (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const role = yield RoleFile.findById(role_id);
      if (role === null || role === undefined) throw "role is not found";

      const actions = yield Action.find({ _id: { $in: role.actions } });

      res.json({
        status: { success: true },
        body: { ...role.toObject(), actions }
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
};

export const updateName = (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const { name } = req.body;
      if (name === undefined || name === null || name === "") throw "name is empty";

      const role = yield RoleFile.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.name = name;
      const changedRoleFile = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleFile
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
        errors.unknown = commons.errorParser(e);
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const updateDescription = (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const { description } = req.body;

      const role = yield RoleFile.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.description = description;
      const changedRoleFile = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleFile
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "role is not found":
        errors.role = "指定されたロールが見つからないため変更に失敗しました";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const remove = (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const role = yield RoleFile.findById(role_id);

      if (role === null) throw "role is empty";

      const deletedRoleFile = role.remove();

      res.json({
        status: { success: true },
        body: deletedRoleFile
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "role is empty":
        errors.role = "指定されたロールが見つからないため削除に失敗しました";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }

      res.json({
        status: { success: false, errors }
      });
    }
  });
};

export const removeActionOfRoleFile = (req, res, next) => {
  co(function* () {
    try {
      const { role_id, action_id } = req.params;
      const [ role, action ] = yield [
        RoleFile.findById(role_id),
        Action.findById(action_id)
      ];

      if (role === null) throw "role is empty";
      if (action === null) throw "action is empty";

      role.actions = role.actions.filter( _action => {
        return _action.toString() !== action._id.toString();
      });

      const changedRoleFile = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleFile
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
        errors.unknown = commons.errorParser(e);
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const addActionToRoleFile = (req, res, next) => {
  co(function* () {
    try {
      const { role_id, action_id } = req.params;
      const [ role, action ] = yield [
        RoleFile.findById(role_id),
        Action.findById(action_id)
      ];

      if (role === null) throw "role is empty";
      if (action === null) throw "action is empty";
      if (role.actions.indexOf(action._id) >= 0 ) throw "action is duplicate";

      role.actions = [ ...role.actions, action._id ];
      const changedRoleFile = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleFile
      });

    }
    catch (e) {
      let errors = {};
      switch (e) {
      case "role is empty":
        errors.role = "指定されたロールが見つからないためアクションの追加に失敗しました";
        break;
      case "action is empty":
        errors.action = "指定されたアクションが見つからないため追加に失敗しました";
        break;
      case "action is duplicate":
        errors.action = "指定されたアクションが既に登録されているため追加に失敗しました";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};
