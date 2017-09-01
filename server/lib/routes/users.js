import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Group from "../models/Group";

const router = Router();

// ユーザ一覧
router.get("/", (req, res, next) => {
  const conditions = {
    tenant_id: mongoose.Types.ObjectId(req.query.tenant_id)
  };

  User.aggregate([
    { $match: conditions },
    { $lookup:
      { from: "groups", localField: "groups", foreignField: "_id", as: "groups" }
    }
  ])
    .then (users => {
      res.json({
        status: { success: true },
        body: users
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, message: "エラー", errors: err },
        body: {}
      });
    });

});

// ユーザ詳細
router.get("/:id", (req, res, next) => {

  User.findById(req.params.id)
    .then( user => {
      res.user = user;
      return Tenant.findById(user.tenant_id);
    })
    .then( tenant => {
      res.tenant = tenant;
      const group_ids = res.user.groups.map( group => mongoose.Types.ObjectId(group));
      return Group.find({ _id: group_ids });
    })
    .then( groups => {
      res.groups = groups;
      return;
    })
    .then( () => {
      const user = {
        ...res.user.toObject(),
        tenant: res.tenant.toObject(),
        groups: res.groups
      };

      res.json({
        status: { success: true },
        body: user
      });
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        status: { success: false, message: "ユーザ取得時にエラー" },
        body: {}
      });
    });

});

// ユーザ追加
router.post("/", (req, res, next) => {
  const user = new User(req.body);
  const sha = crypto.createHash("sha512");
  sha.update(req.body.password);
  const hash = sha.digest("hex");
  user.password = hash;

  user.save( err => {
    // 何らかの原因で保存に失敗した場合は
    // Internal Server Error(500)を返却する
    if (err) {
      res.status(500).json({
        result: { status: "ng", message: "ユーザの作成に失敗" },
        data: {}
      });
    }
  }).then( user => {
    res.json({
      result: { status: "ok" },
      data: user
    });
  });

});

// パスワード変更
router.patch("/:user_id/password", (req, res, next) => {
  const { user_id } = req.params;
  const { current_password, new_password } = req.body;

  if (!current_password) {
    res.status(400).json({
      status: {
        success: false,
        message: "現在のパスワードが空のためエラー",
        errors: { current_password: "パスワードが空のためエラー" }
      },
      body: {}
    });
  }

  if (!new_password) {
    res.status(400).json({
      status: {
        success: false,
        message: "変更後のパスワードが空のためエラー",
        errors: { new_password: "パスワードが空のためエラー" }
      },
      body: {}
    });
  }

  User.findById(user_id)
    .then( user => {
      const sha = crypto.createHash("sha512");
      sha.update(current_password);
      const hash = sha.digest("hex");
      
      if (hash !== user.password) {
        res.status(400).json({
          status: {
            success: false,
            message: "変更前のパスワードが一致しません",
            errors: { current_password: "変更前のパスワードが一致しません" }
          },
          body: {}
        });
      }

      return user;
    })
    .then( user => {
      const sha = crypto.createHash("sha512");
      sha.update(new_password);
      const hash = sha.digest("hex");
      user.password = hash;
      return user.save();
    })
    .then( changedUser => {
      res.json({
        status: { success: true, message: "パスワードが変更されました" },
        body: changedUser
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, message: "パスワードの変更に失敗", errors: err },
        body: {}
      });
    });

});

// 所属グループの追加
router.post("/:user_id/groups", (req, res, next) => {

  const user_id = req.params.user_id;
  const group_id = req.body.group_id;

  const tasks = [
    User.findById(user_id).then( user => user ),
    Group.findById(group_id).then( group => group )
  ];

  Promise.all(tasks)
    .then( result => {
      const [ user, group ] = result;
      if (!user) throw `存在しないユーザです user_id: ${user_id}`;
      if (!group) throw `存在しないグループです group_id: ${group_id}`;

      user.groups = [...user.groups, group._id];
      return user.save();
    })
    .then( user => {
      res.json({
        status: { success: true },
        body: user
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
  
});

// 所属グループの削除
router.delete("/:user_id/groups/:group_id", (req, res, next) => {
  const { user_id, group_id } = req.params;

  const tasks = [
    User.findById(user_id).then( user => user ),
    Group.findById(group_id).then( group => group )
  ];

  Promise.all(tasks)
    .then( result => {
      const [ user, group ] = result;
      user.groups = user.groups.filter(
        _group => _group.toString() !== group._id.toString() );
      return user.save();
    })
    .then( user => {
      res.json({
        status: { success: true },
        body: user
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
});

export default router;
