import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/User";
import Tenant from "../models/Tenant";

const router = Router();

// all
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

// view
router.get("/:id", (req, res, next) => {

  User.findById(req.params.id)
    .then( user => {
      
      Tenant.findById(user.tenant_id)
        .then( tenant => {

          res.json({
            status: { success: true },
            body: Object.assign(user.toObject(), { tenant: tenant.toObject() })
          });

        })
        .catch( err => {
          res.status(500).json({
            status: { success: false, message: "テナントが存在しません" },
            body: {}
          });
        });

    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, message: "ユーザが存在しません" },
        body: {}
      });
    });

});

// add
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

// delete
router.delete("/:id", (req, res, next) => {
  const conditions = {
    _id: req.params.id
  };

  // idが存在しない場合(0件の削除)でも正常終了を返却？
  User.remove(conditions).then( msg => {
    res.json({
      result: { status: "ok" },
      data: msg.result
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

export default router;
