import mongoose from "mongoose";
import co from "co";
import Group from "../models/Group";
import User from "../models/User";
import RoleMenu from "../models/RoleMenu";
import AuthorityMenu from "../models/AuthorityMenu";

// etc
import logger from "../logger";
import { first } from "lodash";

const { ObjectId } = mongoose.Types;

export const index = (req, res, next) => {
  co(function* () {
    try {

      const { q } = req.query;
      const { tenant_id } = res.user;

      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      let conditions;
      if(q){
        conditions = {
          $and: [
            {name: new RegExp(q, "i")} ,
            {tenant_id: ObjectId(tenant_id)}
          ]
        };
      }else{
        conditions = {
          $and: [
            {tenant_id: ObjectId(tenant_id)}
          ]
        };
      }

      const groups = yield Group.find(conditions);

      const group_ids = groups.map( group => group._id );

      const users = yield User.find({ groups: { $in: group_ids } });

      const _groups = groups.map( group => {

        const belongs_to = users.filter( user => {
          return user.groups
            .map(group => group.toString())
            .includes(group._id.toString());
        });

        return {
          ...group.toObject(),
          belongs_to
        };
      });

      res.json({
        status: { success: true },
        body: _groups
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

export const create = (req, res, next) => {
  co(function*() {

    try {
      const group = new Group(req.body.group);

      if (group.name === undefined
          || group.name === null
          || group.name === "") throw "name is empty";

      const _group = yield Group.findOne({ name: group.name });
      if ( _group !== null ) throw "name is duplicate";

      group.tenant_id = res.user.tenant_id;
      const createdGroup = yield group.save();

      res.json({
        status: { success: true },
        body: createdGroup
      });

    }
    catch (err) {
      let errors = {};

      switch (err) {
      case "name is empty":
        errors.name = "名称が空のため作成に失敗しました";
        break;
      case "name is duplicate":
        errors.name = "同名のグループが既に存在するため作成に失敗しました";
        break;
      default:
        errors = err;
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
      const { group_id } = req.params;

      if (group_id === undefined ||
          group_id === null ||
          group_id === "") throw "group_id is empty";

      const group = yield Group.findById(group_id);

      if (group === null) throw "group is empty";

      const users = yield User.find({ groups: group._id });

      res.json({
        status: { success: true },
        body: { ...group.toObject(), belongs_to: users }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "group_id is empty":
        errors.group_id = e;
        break;
      case "group is empty":
        errors.group = e;
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

export const remove = (req, res, next) => {
  co(function* () {
    const { group_id } = req.params;

    try {
      const group = yield Group.findById(group_id);

      if (group === undefined ||
          group === null) throw "group not found";

      const removedGroup = yield group.remove();

      res.json({
        status: { success: true },
        body: removedGroup
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "group not found":
        errors.group = "指定されたグループが見つかりません";
        break;
      default:
        errors = e;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const updateName = (req, res, next) => {
  co(function* () {
    try {
      const { name } = req.body;

      if (name === null || name === undefined || name === "") throw "name is empty";

      const { group_id } = req.params;

      const group = yield Group.findById(group_id);

      if (group === null) throw "group is not found";

      group.name = name;

      const changedGroup = yield group.save();

      res.json({
        status: { success: true },
        body: changedGroup
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "name is empty":
        errors.name = "グループ名が空のため変更に失敗しました";
        break;
      case "group is not found":
        errors.group = "指定されたグループが見つからないため変更に失敗しました";
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

export const updateDescription = (req, res, next) => {
  co(function* () {
    const { description } = req.body;
    const { group_id } = req.params;

    try {
      const group = yield Group.findById(group_id);
      if (group === null || group === undefined) throw "group is not found";

      group.description = description;
      const changedGroup = yield group.save();

      res.json({
        status: { success: true },
        body: changedGroup
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "group is not found":
        errors.group = "指定されたグループが見つかりませんでした";
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

export const updateRoleMenus = (req, res) => {
  co(function* (){
    try {
      const group_id = req.params.group_id;
      const { role_menu_id } = req.body;

      const [ group ,role ] = yield [Group.findById(group_id), RoleMenu.findById(role_menu_id) ];
      if (group === null) throw "group is empty";
      if (role === null) throw "role is empty";

      let authorityMenus = first( yield AuthorityMenu.find({users: ObjectId(group._id)}));
      if(authorityMenus === undefined ){
        authorityMenus = new AuthorityMenu();
        authorityMenus.groups = group;
      }

      authorityMenus.role_menus = role;
      const savedAuthorityMenus = yield authorityMenus.save();

      res.json({
        status: { success: true },
        body: savedAuthorityMenus
      });

    } catch (e) {
      let errors = {};

      switch (e) {
        case "group is empty":
          errors.group = "存在しないグループです";
          break;
        case "role is empty":
          errors.role_menus = "存在しないユーザタイプです";
          break;
        default:
          errors.unknown = e;
          break;
      }
      logger.error(e);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};
