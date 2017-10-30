import mongoose from "mongoose";
import co from "co";
import RoleMenu from "../models/RoleMenu";
import Menu from "../models/Menu";
import { logger } from "../index";
import * as commons from "./commons";

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

export const create = (req, res, next) => {
  co(function* () {
    try {
      const { role } = req.body;

      if (role.name === undefined ||
          role.name === null ||
          role.name === "") throw "name is empty";

      const _role = yield RoleMenu.findOne({
        name: role.name,
        tenant_id: res.user.tenant_id
      })

      if( _role !== null ) throw "name is duplicate";

      const newRoleMenu = new RoleMenu();
      newRoleMenu.name = role.name;
      newRoleMenu.description = role.description;
      newRoleMenu.tenant_id = res.user.tenant_id;

      const createRoleMenu = yield newRoleMenu.save();

      res.json({
        status: { success: true },
        body: createRoleMenu
      })

    }catch(e){
      let errors = {};

      switch(e){
        case "name is empty":
          errors.name = "ユーザタイプ名が空のため作成に失敗しました";
          break;
        case "name is duplicate":
          errors.name = "同名のユーザタイプが既に存在するため作成に失敗しました";
          break;
        default:
          errors.unknown = commons.errorParser(e);
      }
      logger.error(e);

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  })
};

export const view = (req, res, next) => {
  co(function*() {
    try {

      const { role_id } = req.params;

      const role = yield RoleMenu.findById(role_id);
      if(role === null || role === undefined) throw "role is not found";

      const menus = yield Menu.find({ _id: { $in: role.menus }});

      res.json({
        status: { success: true },
        body: { ...role.toObject(), menus }
      });

    } catch (e) {
      let errors = {};

      switch (e) {
        case "role is not found":
          errors.role = "ユーザタイプが存在しません";
          break
        default:
          errors.unknown = commons.errorParser(e);
          break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
}

export const remove = (req, res, next) => {
  co(function* (){
    try {
      const { role_id } = req.params;
      const role = yield RoleMenu.findById(role_id);

      if (role === null) throw "role is empty";

      const deletedRoleMenu = role.remove();

      res.json({
        status: { success: true },
        body: deletedRoleMenu
      });


    } catch (e) {
      let errors = {};

      switch (e) {
        case "role is empty":
          errors.role = "指定されたユーザタイプが見つからないため削除に失敗しました";
          break
        default:
          errors.unknown = commons.errorParser(e);
          break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
}

export const updateName = (req, res, next) => {
  co(function* (){
    try {

      const { role_id } = req.params;
      const { name } = req.body;
      if (name === undefined || name === null || name === "") throw "name is empty";

      const role = yield RoleMenu.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.name = name;
      const changedRoleMenu = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleMenu
      });

    } catch (e) {
      let errors = {};

      switch (e) {
        case "name is empty":
          errors.name = "名称が空のため変更に失敗しました";
          break;
        case "role is not found":
          errors.role = "指定されたユーザタイプが見つからないため変更に失敗しました";
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
}


export const updateDescription = (req, res, next) => {
  co(function* () {
    try {
      const { role_id } = req.params;
      const { description } = req.body;

      const role = yield RoleMenu.findById(role_id);
      if (role === undefined || role === null) throw "role is not found";

      role.description = description;
      const changedRoleMenu = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleMenu
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "role is not found":
        errors.role = "指定されたユーザタイプが見つからないため変更に失敗しました";
        break;
      default:
        errors.unknown = commons.errorParser(e);
        break;
      }
      logger.error(e);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const addMenuToRoleMenu = (req, res, next) => {
  co(function* (){
    try {
      const { role_id, menu_id } = req.params;
      const [ role, menu ] = yield [
        RoleMenu.findById(role_id),
        Menu.findById(menu_id)
      ];

      if( role === null ) throw "role is empty";
      if( menu === null ) throw "menu is empty";
      if( role.menus.indexOf(menu._id) >= 0 ) throw "menu is duplicate";

      role.menus = [ ...role.menus, menu._id ];

      const changedRoleMenu = yield role.save();

      res.json({
        status: { success: true },
        body: changedRoleMenu
      })

    } catch (e) {
      let errors = {};

      switch (e) {
        case "role is empty":
          errors.role = "指定されたユーザタイプが見つからないためメニューの追加に失敗しました";
          break;
        case "menu is empty":
          errors.memu = "指定されたメニューが見つからないため追加に失敗しました";
          break;
        case "menu is duplicate":
          errors.menu = "指定されたメニューが既に登録されているため追加に失敗しました"
        default:
          errors.unknown = commons.errorParser(e);
          break;
      }
      logger.error(e);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
}

export const removeMenuOfRoleMenu = (req, res, next) => {
  co(function*(){
    try {
      const { role_id, menu_id } = req.params;
      const [ role, menu ] = yield [
        RoleMenu.findById(role_id),
        Menu.findById(menu_id)
      ];

      if( role === null ) throw "role is empty";
      if( menu === null ) throw "menu is empty";

      role.menus = role.menus.filter( _menus => (_menus.toString() !== menu._id.toString()));

      const changedRoleMenu = yield role.save();

      res.json({
        status: { success: true},
        body: changedRoleMenu
      });

    } catch (e) {
      let errors = {};

      switch (e) {
        case "role is empty":
          errors.role = "指定されたユーザタイプが見つからないためメニューの追加に失敗しました";
          break;
        case "menu is empty":
          errors.memu = "指定されたメニューが見つからないため追加に失敗しました";
          break;
        default:
          errors.unknown = commons.errorParser(e);
          break;
      }
      logger.error(e);
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
}