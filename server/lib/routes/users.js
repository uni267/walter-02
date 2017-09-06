import { Router } from "express";
import mongoose from "mongoose";
import co from "co";
import crypto from "crypto";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Group from "../models/Group";

const router = Router();

// ユーザ一覧
router.get("/", (req, res, next) => {

  let conditions = {
    tenant_id: mongoose.Types.ObjectId(req.query.tenant_id)
  };

  if (req.query.q) {
    conditions = {
      $and: [
        { tenant_id: mongoose.Types.ObjectId(req.query.tenant_id) },
        { name: new RegExp(req.query.q, "i") }
      ]
    };
  }

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

  const main = function*() {

    try {
      const user = new User(req.body.user);

      if (user.name === undefined
          || user.name === null
          || user.name === "") throw "name is empty";

      if (user.email === undefined
          || user.email === null
          || user.email === "") throw "email is empty";

      if (user.password === undefined
          || user.password === null
          || user.password === "") throw "password is empty";

      const sha = crypto.createHash("sha512");
      sha.update(user.password);
      const hash = sha.digest("hex");
      user.password = hash;
      
      const createdUser = yield user.save();

      res.json({
        statsus: { success: true },
        body: createdUser
      });
    }
    catch (err) {
      let errors = {};

      switch (err) {
      case "name is empty":
        errors.name = "表示名が空です";
        break;
      case "email is empty":
        errors = { email: "メールアドレスが空です" };
        break;
      case "password is emtpy":
        errors = { password: "パスワードが空です" };
        break;
      default:
        errors = err;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  };

  co(main);

});

// パスワード変更
router.patch("/:user_id/password", (req, res, next) => {
  const { user_id } = req.params;
  const { current_password, new_password } = req.body;

  User.findById(user_id)
    .then( user => {
      if (current_password === null || 
          current_password === ""   ||
          current_password === undefined) throw "current password is empty";

      if (new_password === null ||
          new_password === ""   ||
          new_password === undefined) throw "new password is empty";

      if (user === null || user === undefined) throw "user not found";

      const sha = crypto.createHash("sha512");
      sha.update(current_password);
      const hash = sha.digest("hex");
      
      if (hash !== user.password) throw "password is not match";

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
      switch (err) {
      case "current password is empty":
        res.status(400).json({
          status: {
            success: false,
            errors: { current_password: "パスワードが空のためエラー" }
          }
        });
      case "new password is empty":
        res.status(400).json({
          status: {
            success: false,
            errors: { new_password: "パスワードが空のためエラー" }
          }
        });
      case "password is not match":
        res.status(400).json({
          status: {
            success: false,
            errors: { current_password: "変更前のパスワードが一致しません" }
          }
        });
      case "user not found":
        res.status(400).json({
          status: { success: false, errors: { err } }
        });

      default:
        res.status(500).json({
          status: { success: false, message: "パスワードの変更に失敗", errors: err },
          body: {}
        });
      }
    });
});

// 有効/無効のトグル
router.patch("/:user_id/enabled", (req, res, next) => {
  const user_id = req.params.user_id;

  User.findById(user_id)
    .then( user => {
      if (!user) throw "指定されたユーザは存在しません";

      user.enabled = !user.enabled;
      user.save();
    })
    .then( user => {
      res.json({
        status: { success: true },
        body: user
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, message: err }
      });
    });

});

// 表示名変更
router.patch("/:user_id/name", (req, res, next) => {
  const user_id = req.params.user_id;
  const name = req.body.name;

  User.findById(user_id)
    .then( user => {
      if (!user) throw "指定されたユーザが見つかりません";

      user.name = name;
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
        status: { success: false, message: err }
      });
    });
});

// メールアドレス変更
router.patch("/:user_id/email", (req, res, next) => {
  const user_id = req.params.user_id;
  const email = req.body.email;

  User.findById(user_id)
    .then( user => {
      if (!user) throw "指定されたユーザが見つかりません";
      if (email === ""   || 
          email === null ||
          email === undefined) throw "メールアドレスが空です";

      user.email = email;
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
        status: { success: false, message: err }
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
