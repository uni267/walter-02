import { Router } from "express";
import mongoose from "mongoose";
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
  const changedName = req.body.name;

  Group.findById(req.params.group_id)
    .then( group => {
      if (group === null) throw "group is not found";

      if (changedName === null
          || changedName === undefined
          || changedName === "") throw "name is empty";

      return group;
    })
    .then( group => {
      group.name = changedName;
      return group.save();
    })
    .then( group => {
      res.group = group;
      return User.find({ groups: group._id });
    })
    .then( users => {
      const group = res.group.toObject();
      group.belongs_to = users;

      res.json({
        status: { success: true },
        body: group
      });
    })
    .catch ( err => {
      let errors;

      switch (err) {
      case "name is empty":
        errors = { name: "グループ名が空です" };
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

// 備考変更
router.patch("/:group_id/description", (req, res, next) => {
  res.json();
});

export default router;
