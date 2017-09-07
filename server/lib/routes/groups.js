import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import Group from "../models/Group";
import User from "../models/User";

const router = Router();

// index
router.get("/", (req, res, next) => {

  Group.find({ tenant_id: mongoose.Types.ObjectId(req.query.tenant_id) })
    .then( groups => {
      res.groups = groups;
      const group_ids = groups.map( group => group._id );
      return User.find({ groups: { $in: group_ids } },
                       { name: 1, groups: 1 });
    })
    .then( users => {
      return res.groups.map( group => {
        const belongs_to = users.filter( user => {
          return user.groups
            .map(group => group.toString())
            .includes(group.id.toString());
        });

        return {
          ...group.toObject(),
          belongs_to
        };
      });
    })
    .then( groups => {
      res.json({
        status: { success: true },
        body: groups
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
});

// view
router.get("/:group_id", (req, res, next) => {
  const group_id = req.params.group_id;

  Group.findById(group_id)
    .then( group => {
      if (group === null) throw "group not found";

      res.group = group;
      return;
    })
    .then( () => {
      return User.find({ groups: res.group._id });
    })
    .then( users => {
      const group = res.group.toObject();
      group.belongs_to = users;

      res.json({
        status: { success: true },
        body: group
      });
    })
    .catch( err => {
      let errors;

      switch (err) {
      case "group not found":
        errors = "group not found";
        break;
      default:
        errors = err;
        break;
      }

      res.status(500).json({
        status: { success: false, errors }
      });

    });
});

// 名称変更
router.patch("/:group_id/name", (req, res, next) => {

  const main = function* () {

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

  };

  co(main);

});

// 備考変更
router.patch("/:group_id/description", (req, res, next) => {

  const main = function* () {
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
  };

  co(main);
});

// 新規作成
router.post("/", (req, res, next) => {
  const main = function*() {

    try {
      const group = new Group(req.body.group);

      if (group.name === undefined
          || group.name === null
          || group.name === "") throw "name is empty";

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
        errors.name = "名称が空です";
        break;
      default:
        errors = err;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }

  };

  co(main);
  
});


export default router;
