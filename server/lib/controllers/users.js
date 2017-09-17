import mongoose from "mongoose";
import co from "co";
import crypto from "crypto";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Group from "../models/Group";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { q, tenant_id } = req.query;

      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      const tenant = yield Tenant.findById(tenant_id);
      if (tenant === null) throw "tenant is empty";

      let conditions;

      if (q) {
        conditions = {
          tenant_id: mongoose.Types.ObjectId(tenant_id)
        };
      }
      else {
        conditions = {
          $and: [
            { tenant_id: mongoose.Types.ObjectId(tenant_id) },
            { name: new RegExp(q, "i") }
          ]
        };
      }

      const users = yield User.aggregate([
        { $match: conditions },
        { $lookup:
          { from: "groups", localField: "groups", foreignField: "_id", as: "groups" }
        }
      ]);

      res.json({
        status: { success: true },
        body: users
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "tenant_id is empty":
        errors.tenant_id = e;
        break;
      case "tenant is empty":
        errors.tenant = e;
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

export const view = (req, res, next) => {
  co(function* () {
    try {
      const { user_id } = req.params;
      if (user_id === undefined ||
          user_id === null ||
          user_id === "") throw "user_id is empty";

      const user = yield User.findById(user_id);
      if (user === null) throw "user is empty";

      const tenant = yield Tenant.findById(user.tenant_id);

      const group_ids = user.groups.map( group => mongoose.Types.ObjectId(group) );
      const groups = yield Group.find({ _id: group_ids });

      res.json({
        status: { success: true },
        body: {
          ...user.toObject(),
          tenant: tenant.toObject(),
          groups
        }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "user_id is empty":
        errors.user_id = e;
        break;
      case "user is empty":
        errors.user = e;
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

export const add = (req, res, next) => {
  co(function*() {
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
        status: { success: true },
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
        errors.email = "メールアドレスが空です";
        break;
      case "password is empty":
        errors.password = "パスワードが空です";
        break;
      default:
        errors = err;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const updatePassword = (req, res, next) => {
  co(function* () {
    try {
      const { user_id } = req.params;
      const { current_password, new_password } = req.body;

      if (current_password === null || 
          current_password === ""   ||
          current_password === undefined) throw "current password is empty";

      if (new_password === null ||
          new_password === ""   ||
          new_password === undefined) throw "new password is empty";

      const user = yield User.findById(user_id);
      if (user === null || user === undefined) throw "user not found";

      const current_sha = crypto.createHash("sha512");
      current_sha.update(current_password);
      const current_hash = current_sha.digest("hex");
      
      if (current_hash !== user.password) throw "password is not match";

      const new_sha = crypto.createHash("sha512");
      new_sha.update(new_password);
      const new_hash = new_sha.digest("hex");
      user.password = new_hash;

      const changedUser = yield user.save();

      res.json({
        status: { success: true },
        body: changedUser
      });
      
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "current password is empty":
        errors.current_password = "パスワードが空のため変更に失敗しました";
        break;
      case "new password is empty":
        errors.new_password = "パスワードが空のため変更に失敗しました";
        break;
      case "password is not match":
        errors.current_password = "変更前のパスワードが一致しないため変更に失敗しました";
        break;
      case "user not found":
        errors.user = "指定されたユーザが存在しないため変更に失敗しました";
        break;
      default:
        errors.unknown = "変更に失敗しました";
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
};

export const updatePasswordForce = (req, res, next) => {
  co(function* () {
    try {
      const { user_id } = req.params;
      const { password } = req.body;

      if (user_id === undefined ||
          user_id === null ||
          user_id === "") throw "user_id is empty";

      if (password === undefined ||
          password === null ||
          password === "") throw "password is empty";

      const user = yield User.findById(user_id);

      if (user === null) throw "user is empty";

      const sha = crypto.createHash("sha512");
      sha.update(password);
      const hash = sha.digest("hex");

      user.password = hash;
      const changedUser = yield user.save();

      res.json({
        status: { success: true },
        body: changedUser
      });
    }
    catch (e) {
      let errors = {};
      
      switch (e) {
      case "user_id is empty":
        errors.user_id = e;
        break;
      case "password is empty":
        errors.password = "パスワードが空のため変更に失敗しました";
        break;
      case "user is empty":
        errors.user = e;
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

export const toggleEnabled = (req, res, next) => {
  co(function* () {
    try {
      const { user_id } = req.params;
      if (user_id === undefined ||
          user_id === null ||
          user_id === "") throw "user_id is empty";

      const user = yield User.findById(user_id);
      if (user === null) throw "user is empty";

      user.enabled = !user.enabled;
      const changedUser = yield user.save();

      res.json({
        status: { success: true },
        body: changedUser
      });
    }
    catch (e) {
      let errors = {};
      switch (e) {
      case "user_id is empty":
        errors.user_id = e;
        break;
      case "user is empty":
        errors.user = "指定されたユーザは存在しません";
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

export const updateName = (req, res, next) => {
  const user_id = req.params.user_id;
  const name = req.body.name;

  User.findById(user_id)
    .then( user => {
      if (user === null
          || user === undefined
          || user === "") throw "user not found";

      if (name === null
          || name === undefined
          || name === "") throw "name is empty";

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
      let errors = {};

      switch (err) {
      case "name is empty":
        errors.name = "表示名が空のため変更に失敗しました。";
        break;
      case "user not found":
        errors.user = "指定されたユーザが見つからないため変更に失敗しました";
        break;
      default:
        errors = err;
        break;
      }

      res.status(400).json({
        status: { success: false, errors }
      });
    });
};

export const updateEmail = (req, res, next) => {
  co(function* () {
    try {
      const { user_id } = req.params;
      const { email } = req.body;

      if (user_id === "" ||
          user_id === undefined ||
          user_id === null) throw "user_id is empty";

      if (email === ""
          || email === null
          || email === undefined) throw "email is empty";

      const user = yield User.findById(user_id);
      if (user === null) throw "user is empty";

      user.email = email;
      const changedUser = yield user.save();

      res.json({
        status: { success: true },
        body: changedUser
      });
    }
    catch (e) {
      let errors = {};
      switch (e) {
      case "user_id is empty":
        errors.user_id = e;
        break;
      case "email is empty":
        errors.email = "メールアドレスが空のため変更に失敗しました";
        break;
      case "user is empty":
        errors.user = "指定されたユーザが見つからないため変更に失敗しました";
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

export const addUserToGroup = (req, res, next) => {
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
};

export const removeUserOfGroup = (req, res, next) => {
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
};
