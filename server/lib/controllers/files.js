import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import co from "co";
import jwt from "jsonwebtoken";
import multer from "multer";
import moment from "moment";
import morgan from "morgan";
import { exec } from "child_process";
import util from "util";
import crypto from "crypto";
import {
  intersection,
  zipWith,
  flattenDeep
} from "lodash";

// etc
import { logger } from "../index";
import * as commons from "./commons";
import { ValidationError, RecordNotFoundError } from "../errors/AppError";

// constants
import { SECURITY_CONF } from "../../configs/server";
import * as constants from "../../configs/constants";

// models
import Dir from "../models/Dir";
import File from "../models/File";
import Preview from "../models/Preview";
import Tag from "../models/Tag";
import MetaInfo from "../models/MetaInfo";
import User from "../models/User";
import Tenant from "../models/Tenant";
import RoleFile from "../models/RoleFile";
import AuthorityFile from "../models/AuthorityFile";
import Action from "../models/Action";
import FileMetaInfo from "../models/FileMetaInfo";
import { Swift } from "../storages/Swift";

export const index = (req, res, next) => {
  co(function* () {
    try {
      let { dir_id, page ,sort ,order} = req.query;
      // デフォルトはテナントのホーム
      if (dir_id === null || dir_id === undefined || dir_id === "") {
        dir_id = res.user.tenant.home_dir_id;
      }

      const file_ids = yield getAllowedFileIds(res.user._id, constants.PERMISSION_VIEW_LIST );

      const conditions = {
        dir_id: mongoose.Types.ObjectId(dir_id),
        is_deleted: false,
        _id: {$in : file_ids}
      };
      const sortOption = createSortOption(sort, order);

      // pagination
      if (page === undefined || page === null || page === "") page = 0;
      const limit = constants.FILE_LIMITS_PER_PAGE;
      const offset = page * limit;

      const total = yield File.find(conditions).count();

      let files = yield File.searchFiles(conditions,offset,limit,sortOption);

      res.json({
        status: { success: true, total },
        body: files
      });
    }
    catch (e) {

      let errors = {};
      switch (e) {
      case "dir_id is empty":
        errors.dir_id = "dir_id is empty";
        break;
      default:
        errors.unknown = e;
      }
      logger.error(errors);
      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
};

export const view = (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const file_ids = yield getAllowedFileIds(res.user._id, constants.PERMISSION_VIEW_DETAIL );
      const conditions = {
        $and:[
          {_id: mongoose.Types.ObjectId(file_id)},
          {_id: {$in : file_ids}}
                ]
        };

      const file = yield File.searchFileOne(conditions);

      if(file === null || file === "" || file === undefined) throw "file is empty";
      if (file.is_deleted) throw "file is deleted";

      const tags = yield Tag.find({ _id: { $in: file.tags } });

      res.json({
        status: { success: true },
        body: { ...file, tags }
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = "ファイルが見つかりません";
        break;
      case "file is empty":
        errors.file = "ファイルが見つかりません";
        break;
      case "file is deleted":
        errors.file = "ファイルは削除されています";
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

export const download = (req, res, next) => {
  co(function* () {
    try {
      const swift = new Swift();

      const { file_id }  = req.query;
      const tenant_name = res.user.tenant.name;

      const fileRecord = yield File.findById(file_id);
      if (fileRecord === null) throw "file not found";
      if (fileRecord.is_deleted) throw "file is deleted";

      const readStream = yield swift.downloadFile(constants.SWIFT_CONTAINER_NAME, fileRecord);
      readStream.on("data", data => res.write(data) );
      readStream.on("end", () => res.end() );
    }
    catch (e) {
      logger.error(e);
      console.log(e);
    }
  });
};

export const search = (req, res, next) => {
  co(function* () {
    try {
      const { q, page, sort, order } = req.query;
      const { tenant_id } = res.user.tenant_id;

      const { trash_dir_id } = yield Tenant.findOne(tenant_id);

      const file_ids = yield getAllowedFileIds(res.user._id, constants.PERMISSION_VIEW_LIST );

      const conditions = {
        dir_id: { $ne: trash_dir_id },
        $or: [
          { name: { $regex: q } },
          { "meta_infos.value": { $regex: q } }
        ],
        is_display: true,
        is_deleted: false,
        _id: {$in : file_ids}
      };

      const _page = page === undefined || page === null || page === ""
            ? 0 : page;

      const limit = constants.FILE_LIMITS_PER_PAGE;
      const offset = _page * limit;
      const total = yield File.find(conditions).count();

      const _sort = createSortOption(sort, order);

      let files = yield File.searchFiles(conditions,offset,limit,_sort);

      files = files.map( file => {
        const route = file.dirs
              .filter( dir => dir.ancestor.is_display )
              .map( dir => dir.ancestor.name );

        file.dir_route = route.length > 0
          ? route.reverse().join("/")
          : "";
        return file;
      });

      res.json({
        status: { success: true, total },
        body: files
      });
    }
    catch (e) {
      res.json({
        status: { success: false, message: "ファイルの取得に失敗", errors: e },
        body: []
      });
    }
  });
};

export const searchItems = (req, res, next) => {
  co(function* () {
    try {
      const { tenant_id } = res.user;

      if (tenant_id === undefined ||
          tenant_id === null ||
          tenant_id === "") throw "tenant_id is empty";

      let { meta_only } = req.query;

      if (meta_only === undefined ||
          meta_only === null ||
          meta_only === "") {
        meta_only = false;
      }

      const conditions = {
          tenant_id: mongoose.Types.ObjectId(tenant_id)
      };

      if (meta_only === "true") conditions.key_type = "meta";

      const meta_infos = yield MetaInfo.find(conditions)
            .select({ key: 1, key_type: 1, value_type: 1 });

      res.json({
        status: { success: true, message: "正常に取得が完了" },
        body: meta_infos
      });
    }
    catch (e) {
      const errors = {};
      errors.unknown = commons.errorParser(e);

      res.status(400).json({
        status: { success: false, message: "取得時にエラーが発生", errors }
      });
    }
  });
};

export const searchDetail = (req, res, next) => {
  const buildQuery = (item) => {
    switch ( item.key_type ) {
    case "name":
      return ({
        [item.key_type]: {
          $regex: item.value
        },
        is_display: true
      });
    case "modified_less":
      return ({
        modified: {
          $lt: item.value
        },
        is_display: true
      });
    case "modified_greater":
      return ({
        modified: {
          $gt: item.value
        },
        is_display: true
      });
    case "meta":
      return ({
        "meta_infos.meta_info_id": mongoose.Types.ObjectId(item._id),
        "meta_infos.value": { $regex: item.value },
        is_display: true
      });
    case "tags":
      return ({
        tags: mongoose.Types.ObjectId(item.value),
        is_display: true
      });
    default:
      return ({
        [item.key_type]: item.value,
        is_display: true
      });
    }
  };

  co(function* () {
    try {
      const params = req.query;

      const param_ids = Object.keys(params)
            .filter( p => !["page", "order", "sort"].includes(p) );

      const metainfos = yield MetaInfo.find({ _id: param_ids });

      const queries = metainfos.map( meta => {
        const _meta = meta.toObject();
        _meta.value = params[meta._id];
        return _meta;
      });

      const base_items = queries.filter( q => q.key_type !== "meta" );
      const meta_items = queries.filter( q => q.key_type === "meta" );

      const base_queries = base_items[0] === undefined
            ? {}
            : Object.assign(...base_items.map(buildQuery));

      const meta_queries = meta_items[0] === undefined
            ? {}
            : Object.assign(...meta_items.map(buildQuery));

      const limit = constants.FILE_LIMITS_PER_PAGE;
      let { page } = req.query;
      if (!page) page = 0;
      const offset = page * limit;

      const query = { ...base_queries, ...meta_queries };

      const total = yield File.find(query).count();

      const { sort, order } = params;
      const _sort = createSortOption(sort, order);

      const files = yield File.find(query)
            .skip(offset)
            .limit(limit)
            .sort(_sort);

      res.json({
        status: { success: true, total },
        body: files
      });
    }
    catch (e) {
      console.log(e);
      res.json({e});
    }
  });
};

export const rename = (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      const changedFileName = req.body.name;

      if (file_id === null ||
          file_id === undefined ||
          file_id === "") throw "file_id is empty";

      if (changedFileName === null ||
          changedFileName === undefined ||
          changedFileName === "") throw "name is empty";

      const file = yield File.findById(file_id);
      file.name = changedFileName;
      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      console.log(e);
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.fild_id = "file_id is empty";
        break;
      case "name is empty":
        errors.name = "ファイル名が空のため変更に失敗しました";
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

export const move = (req, res, next) => {
  co(function* () {
    try {
      const file_id = req.params.file_id;
      const dir_id = req.body.dir_id;
      const user = yield User.findById(res.user._id);

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (dir_id === undefined ||
          dir_id === null ||
          file_id === "") throw "dir_id is empty";

      if (user === null) throw "user is empty";

      const [ file, dir ] = yield [ File.findById(file_id), File.findById(dir_id) ];

      if (file === null) throw "file is empty";
      if (dir === null) throw "dir is empty";

      const changedFile = yield moveFile(file, dir._id, user, "移動");

      res.json({
        status: { success: true },
        body: changedFile
      });
    }
    catch (e) {
      let errors = {};
      // @todo ちゃんとメッセージを実装する
      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "dir_id is empty":
        errors.dir_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "dir is empty":
        errors.dir = e;
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

export const upload = (req, res, next) => {
  co(function* () {
    try {
      const myFiles  = req.body.files;
      let dir_id = req.body.dir_id;

      if (myFiles === null ||
          myFiles === undefined ||
          myFiles === "" ||
          myFiles.length === 0) throw new ValidationError("files is empty");

      if (dir_id === null ||
          dir_id === undefined ||
          dir_id === "" ||
          dir_id === "undefined") {

        dir_id = res.user.tenant.home_dir_id;
      }

      const dir = yield File.findById(dir_id);

      if (dir === null) throw new RecordNotFoundError("dir_id is not found");

      const user = yield User.findById(res.user._id);

      if (user === null) throw new RecordNotFoundError("user_id is not found");

      // ファイルの基本情報
      // Modelで定義されていないプロパティを使いたいので
      // オブジェクトで作成し、後でModelObjectに一括変換する
      let files = myFiles.map( _file => {
        const file = {
          hasError: false,  // エラーフラグ
          errors: {}        // エラー情報
        };

        if (_file.name === null || _file.name === undefined ||
            _file.name === "" || _file.name === "undefined") {
          file.hasError = true;
          file.errors = { name: "file name is empty" };
        }

        if (_file.mime_type === null || _file.mime_type === undefined ||
            _file.mime_type === "" || _file.mime_type === "undefined") {
          file.hasError = true;
          file.errors = { mime_type: "mime_type is empty" };
        }

        if (_file.size === null || _file.size === undefined ||
            _file.size === "" || _file.size === "undefined") {
          file.hasError = true;
          file.errors = { size: "size is empty" };
        }

        if (_file.base64 === null || _file.base64 === undefined ||
            _file.base64 === "" || _file.base64 === "undefined") {
          file.hasError = true;
          file.errors = { base64: "base64 is empty" };
        }

        if (_file.checksum === null || _file.checksum === undefined ||
            _file.checksum === "" ) {
          file.hasError = true;
          file.errors = { checksum: "checksum is empty" };
        }

        file.name = _file.name;
        file.mime_type = _file.mime_type;
        file.size = _file.size;
        file.modified = moment().format("YYYY-MM-DD HH:mm:ss");
        file.is_dir = false;
        file.dir_id = dir_id;
        file.is_display = true;
        file.is_star = false;
        file.tags = [];
        file.is_crypted = constants.USE_CRYPTO;
        file.meta_infos = _file.meta_infos;
        file.base64 = _file.base64;
        file.checksum = _file.checksum;

        return file;
      });

      // checksumを比較
      files = files.map( file => {
        if (file.hasError) return file;

        const data = file.base64.match(/;base64,(.*)$/)[1];
        const hexdigest = crypto.createHash("md5")
              .update(new Buffer(data))
              .digest("hex");

        if (file.checksum === hexdigest) {
          return file;
        } else {
          return {
            ...file,
            hasError: true,
            errors: {
              checksum: "invalid checksum"
            }
          };
        }

      });

      // postされたメタ情報の_idがマスタに存在するかのチェック用
      const metainfos = yield MetaInfo.find({
        tenant_id: res.user.tenant_id,
        key_type: "meta"
      });

      // メタ情報のチェック
      files = files.map( file => {
        if (file.hasError) return file;

        if (file.meta_infos === undefined ||
            file.meta_infos.length === 0) return file;

        const valueCheck = file.meta_infos.filter( meta => (
          meta.value === undefined || meta.value === null ||
          meta.value === "" || meta.value === "undefined"
        ));

        if (valueCheck.length > 0) {
          return {
            ...file,
            hasError: true,
            errors: {
              meta_infos: "metainfo value is empty"
            }
          };
        }

        const idCheck = file.meta_infos.filter( meta => (
          meta._id === undefined || meta.value === null ||
          meta.value === "" || meta.value === "undefined"
        ));

        if (idCheck.length > 0) {
          return {
            ...file,
            hasError: true,
            errors: {
              meta_infos: "metainfo id is empty"
            }
          };
        }

        // 積集合を取得したかったのでlodashからintersectionを拝借...
        const intersec = intersection(
          file.meta_infos.map( meta => meta._id),
          metainfos.map( meta => meta._id.toString() )
        );

        if (file.meta_infos.length !== intersec.length) {
          return {
            ...file,
            hasError: true,
            errors: {
              meta_infos: "metainfo id is invalid"
            }
          };
        }

        return file;
      });

      // 履歴
      files = files.map( file => {
        if (file.hasError) return file;

        const histories = [{
          modified: moment().format("YYYY-MM-DD hh:mm:ss"),
          user: user,
          action: "新規作成",
          body: ""
        }];

        file.histories = histories;
        return file;
      });

      // ファイルオブジェクト作成
      let fileModels = files.map( file => (
        file.hasError ? false : new File(file)
      ));

      // swift
      zipWith(files, fileModels, (file, model) => {
        if (file.hasError) return;

        const regex = /;base64,(.*)$/;
        const matches = file.base64.match(regex);
        const data = matches[1];

        const swift = new Swift();
        swift.upload( new Buffer(data, 'base64'), model._id.toString());
      });

      // 権限
      const role = yield RoleFile.findOne({
        tenant_id: mongoose.Types.ObjectId(res.user.tenant_id),
        name: "フルコントロール" // @fixme
      });

      const authorityFiles = zipWith(files, fileModels, (file, model) => {
        if (file.hasError) return false;

        const authorityFile = new AuthorityFile();
        authorityFile.users = user;
        authorityFile.files = model;
        authorityFile.role_files = role;

        return authorityFile;
      });

      fileModels = zipWith(files, fileModels, authorityFiles, (file, model, authFile) => {
        if (file.hasError) return false;

        model.authority_files = [ authFile ];
        return model;
      });

      // メタ情報
      const fileMetaInfos = zipWith(files, fileModels, (file, model) => {
        if (file.hasError) return false;

        return file.meta_infos.map( meta => (
          new FileMetaInfo({
            file_id: model._id,
            meta_info_id: meta._id,
            value: meta.value
          })
        ));

      });

      // authorityFilesの保存
      yield authorityFiles.map( file => file ? file.save() : false );

      // fileMetaInfoの保存
      yield flattenDeep(fileMetaInfos).map( fileMeta => (
        fileMeta ? fileMeta.save() : false 
      ));

      // fileの保存
      const changedFiles = yield fileModels.map( model => (
        model ? model.save() : false
      ));

      // validationErrors
      if (files.filter( f => f.hasError ).length > 0) {
        throw new ValidationError(
          "file is invalid",
          files.map( f => f.hasError ? f : {} )
        );
      }

      res.json({
        status: { success: true },
        body: changedFiles
      });

    }
    catch (e) {
      logger.error(e);

      res.status(400).json({
        status: { success: false, errors: e }
      });
    }
  });
};

export const addTag = (req, res, next) => {
  co(function* () {
    try {
      const file_id = req.params.file_id;
      const tag_id = req.body._id;
      if (file_id === null ||
          file_id === undefined ||
          file_id === "") throw "file_id is empty";

      if (tag_id === null ||
          tag_id === undefined ||
          tag_id === "") throw "tag_id is empty";

      const [ file, tag ] = yield [ File.findById(file_id), Tag.findById(tag_id)];

      if (file === null) throw "file is empty";
      if (tag === null) throw "tag is empty";

      file.tags = [ ...file.tags, tag._id ];
      const changedFile = yield file.save();

      const tags = yield Tag.find({ _id: { $in: file.tags } });

      res.json({
        status: { success: true },
        body: { ...file.toObject(), tags }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "tag_id is empty":
        errors.tag_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "tag is empty":
        errors.tag = e;
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

export const removeTag = (req, res, next) => {
  co(function* () {
    try {
      const { file_id, tag_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (tag_id === undefined ||
          tag_id === null ||
          tag_id === "") throw "tag_id is empty";

      const [ file, tag ] = yield [ File.findById(file_id), Tag.findById(tag_id) ];

      if (file === null) throw "file is empty";
      if (tag === null) throw "tag is empty";

      file.tags = file.tags.filter( file_tag => file_tag.toString() !== tag.id );
      const changedFile = yield file.save();

      const tags = yield Tag.find({ _id: { $in: file.tags } });

      res.json({
        status: { success: true },
        body: { ...file.toObject(), tags }
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "tag_id is empty":
        errors.tag_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "tag is empty":
        errors.tag = e;
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

export const addMeta = (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const { meta, value } = req.body;

      if (meta._id === undefined) throw "meta is empty";

      if (value === undefined ||
          value === null ||
          value === "") throw "value is empty";

      const [ file, metaInfo ] = yield [
        File.findById(file_id),
        MetaInfo.findById(meta._id)
      ];

      if (file === null) throw "file is empty";
      if (metaInfo === null) throw "metaInfo is empty";

      const pushMeta = {
        meta_info_id: metaInfo._id,
        key: metaInfo.key,
        value: value,
        value_type: metaInfo.value_type
      };

      file.meta_infos = [ ...file.meta_infos, pushMeta ];

      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "meta is empty":
        errors.meta = e;
        break;
      case "value is empty":
        errors.value = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "metaInfo is empty":
        errors.metaInfo = e;
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

export const removeMeta = (req, res, next) => {
  co(function* () {
    try {
      const { file_id, meta_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      if (meta_id === undefined ||
          meta_id === null ||
          meta_id === "") throw "meta_id is empty";

      const [ file, metaInfo ] = yield [
        File.findById(file_id),
        MetaInfo.findById(meta_id)
      ];

      if (file === null) throw "file is empty";
      if (metaInfo === null) throw "metaInfo is empty";

      file.meta_infos = file.meta_infos.filter( _meta => {
        return _meta.meta_info_id.toString() !== metaInfo._id.toString();
      });

      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });
    }
    catch (e) {
      let errors = {};

      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "meta_id is empty":
        errors.meta_id = e;
        break;
      case "file is empty":
        errors.file = e;
        break;
      case "metaInfo is empty":
        errors.metaInfo = e;
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

export const toggleStar = (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const file = yield File.findById(file_id);

      if (file === null) throw "file is empty";

      file.is_star = !file.is_star;
      const changedFile = yield file.save();

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      let errors = {};
      switch (e) {
      case "file_id is empty":
        errors.file_id = e;
        break;
      case "file is empty":
        errors.file = e;
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

export const addAuthority = (req, res, next) => {
  co(function* () {
    try {
      const { file_id } = req.params;
      const { user, role } = req.body;

      const file = yield File.findById(file_id);
      if (file === null) throw "file is empty";

      const _user = yield User.findById(user._id);
      if (_user === null) throw "user is empty";

      const _role = yield RoleFile.findById(role._id);
      if (_role === null) throw "role is empty";

      const authority = new AuthorityFile();
      authority.files = file;
      authority.users = _user;
      authority.role_files = _role;
      const createdAuthority = yield authority.save();

      file.authority_files = [
        ...file.authority_files,
        createdAuthority
      ];

      const changedFile = yield file.save()

      res.json({
        status: { success: true },
        body: changedFile
      });

    }
    catch (e) {
      const errors = {};
      switch (e) {
      case "file is empty":
        errors.file = "追加対象のファイルが見つかりません";
        break;
      case "user is empty":
        errors.user = "追加対象のユーザが見つかりません";
        break;
      case "role is empty":
        errors.role = "追加対象のロールが見つかりません";
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

export const moveTrash = (req, res, next) => {
  co(function* () {
    try {
      const file_id = req.params.file_id;

      const { tenant_id } = res.user.tenant_id;
      const { trash_dir_id } = yield Tenant.findOne(tenant_id);

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const user = yield User.findById(res.user._id);
      const file = yield File.findById(file_id);

      if (file === null) throw "file is empty";
      if (user === null) throw "user is empty";

      const changedFile = yield moveFile(file, trash_dir_id, user, "削除");

      res.json({
        status: { success: true },
        body: changedFile
      });
    } catch (e) {
      const errors = {};
      switch (e) {
      case "file_id is empty":
        errors.file_id = "削除対象のファイルが見つかりません";
        break;
      case "file is empty":
        errors.file = "削除対象のファイルが見つかりません";
        break;
      case "user is empty":
        errors.user = "実行ユーザーが見つかりません";
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
}

export const restore = (req, res, next) => {
  co(function* () {
    try {
      const file_id = req.params.file_id;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const user = yield User.findById(res.user._id);
      const file = yield File.findById(file_id);
      const { dir_id } = file.histories[file.histories.length - 1].body;

      if (file === null) throw "file is empty";
      if (user === null) throw "user is empty";
      if (dir_id === null || dir_id === undefined || dir_id === "" ) throw "dir_id is empty";

      const changedFile = yield moveFile(file, dir_id, user, "復元");

      res.json({
        status: { success: true },
        body: changedFile
      });

    } catch (e) {
      const errors = {};
      switch (e) {
      case "file_id is empty":
        errors.file_id = "対象のファイルが見つかりません";
        break;
      case "file is empty":
        errors.file = "対象のファイルが見つかりません";
        break;
      case "user is empty":
        errors.user = "実行ユーザーが見つかりません";
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
}

export const deleteFileLogical = (req,res,next) => {
  co(function* (){
    try {
      const file_id = req.params.file_id;

      if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

      const user = yield User.findById(res.user._id);
      const file = yield File.findById(file_id);

      const history = {
        modified: moment().format("YYYY-MM-DD hh:mm:ss"),
        user: user,
        action: "完全削除",
        body: {
          _id: file._id,
          is_star: file.is_star,
          is_display: file.is_display,
          dir_id: file.dir_id,
          is_dir: file.is_dir,
          size: file.size,
          mime_type: file.mime_type,
          blob_path: file.blob_path,
          name: file.name,
          meta_infos: file.meta_infos,
          tags: file.tags,
          is_deleted: file.is_deleted,
          modified: file.modified,
          __v: file.__v
        }
      };
      file.histories = file.histories.concat(history);

      file.is_deleted = true;
      const deletedFile = yield file.save();

      res.json({
        status: { success: true },
        body: deletedFile
      });

    } catch (e) {
      const errors = {};
      switch (e) {
      case "file_id is empty":
        errors.file_id = "対象のファイルが見つかりません";
        break;
      case "file is empty":
        errors.file = "対象のファイルが見つかりません";
        break;
      case "user is empty":
        errors.user = "実行ユーザーが見つかりません";
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


}

export const deleteFilePhysical = (req,res,next) => {
  co(function* (){
    try {
      // is_delete === true のみ対象ファイル
      // swiftコンテナから削除
      // mongoから削除
      const swift = new Swift();

      const file_id = req.params.file_id;
      const tenant_name = res.user.tenant.name;

      const fileRecord = yield File.findById(file_id);
      if (fileRecord === null) throw "file not found";
      if (fileRecord.is_deleted !== true) throw "file is not deleted";

      const readStream = yield swift.remove(constants.SWIFT_CONTAINER_NAME, fileRecord);

      const deletedFile = yield fileRecord.remove();

      res.json({
        status:{ success: true },
        body: deletedFile
      })

    } catch (e) {
      const errors = {};
      errors.unknown = e;
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
}

export const previewExists = (req, res, next) => {
  co(function* (){
    try {
      // プレビュー画像の存在チェック
      const { file_id } = req.params;

      if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

      const file = yield File.findById(file_id);

      let { preview_id } = file;

      if(preview_id === null || preview_id === undefined || preview_id === "" ){

        const tmpDirPath = path.join(__dirname,'../../tmp');
        const tmpFileName = path.join(tmpDirPath,file.name);

        fs.mkdir(tmpDirPath, (err)=>{
          if(err && err.code !== "EEXIST") logger.info(err)
        });

        const swift = new Swift();
        const downloadFile = yield swift.exportFile(constants.SWIFT_CONTAINER_NAME, file, tmpFileName);

        let command = '';

        switch(file.mime_type){
          case "text/csv":
          case "text/plain":
            // csv,txtファイルはnkfでUTF8に変換後,PDFを経てpng形式に変換する
            command = `cd ${tmpDirPath} && nkf -w ${file.name} > buf.txt && /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --nologo --nofirststartwizard --convert-to pdf buf.txt && convert -background white -alpha remove buf.pdf ${file.name}.png && rm ${file.name} buf.*`;
            break;
          case "application/msword":
          case "application/vnd.ms-excel":
          case "application/vnd.ms-powerpoint":
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
          case "application/vnd.openxmlformats-officedocument.presentationml.template":
            const pdfFileName = file.name.replace(path.extname(file.name),".pdf" );
            command = `cd ${tmpDirPath} && /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --nologo --nofirststartwizard --convert-to pdf "${file.name}" && convert -background white -alpha remove "${pdfFileName}[0]" "${file.name}.png" && rm "${file.name}" "${pdfFileName}"`;
          break;
          case "application/pdf":
            command = `cd ${tmpDirPath} && convert -background white -alpha remove "${file.name}[0]" "${file.name}.png" && rm "${file.name}"`;
            break;
          default:
            throw "this mime_type is not supported yet";
            break;
        }

        if(command !== ""){
          const preview = new Preview();
          // 大きいファイルの場合、タイムアウトするので一度idだけ登録してコマンドの再実行を防止する
          yield preview.save();
          file.preview_id = preview._id;
          const changedFile = yield file.save();

          const execResult = yield _exec(command);

          preview.image = fs.readFileSync(`${tmpFileName}.png`);

          const previewImage = yield preview.save();


          preview_id = file.preview_id;
          fs.unlink(path.join(`${tmpFileName}.png`));
        }
      }else{
        const preview = yield Preview.findById(preview_id);
        if(preview.image === undefined) preview_id = null;
      }


      res.json({
        status:{ success: true },
        body: {
          preview_id: preview_id
        }
      });


    } catch (e) {
      logger.error(e);
      const errors = {};
      switch(e){
        case "this mime_type is not supported yet":
          errors.mime_type = "このファイルはプレビュー画像を表示できません";
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

const _exec = command => {
  return new Promise((resolve, reject)=>{
    exec(command, (err,stdout,stderr) => {
      if(err) return reject({ err, stderr });
      return resolve(true);
    });
  });
};

export const removeAuthority = (req, res, next) => {
};


const moveFile = (file, dir_id, user, action) => {
    const history = {
      modified: moment().format("YYYY-MM-DD hh:mm:ss"),
      user: user,
      action: action,
      body: {
        _id: file._id,
        is_star: file.is_star,
        is_display: file.is_display,
        dir_id: file.dir_id,
        is_dir: file.is_dir,
        size: file.size,
        mime_type: file.mime_type,
        blob_path: file.blob_path,
        name: file.name,
        meta_infos: file.meta_infos,
        tags: file.tags,
        is_deleted: file.is_deleted,
        modified: file.modified,
        __v: file.__v
      }
    };

    file.histories = file.histories.concat(history);

    file.dir_id = dir_id;

    const changedFile = file.save();

    return changedFile;

}

const createSortOption = (_sort=null, _order=null) => {
  const sort = {};
  const order =  _order === "DESC" || _order === "desc" ? -1 : 1;
  if( _sort === undefined || _sort === null || _sort === "" ){
    sort["id"] = order;
  }else{
    sort[_sort] = order;
  }
  return sort;
}

const getAllowedFileIds = (user_id, permission) => {
  return co(function*(){

    const action = yield Action.findOne({ name:permission });
    const role = (yield RoleFile.find({ actions:{$all : [action._id] } },{'_id':1})).map( role => mongoose.Types.ObjectId(role._id) );


    const authorities = yield AuthorityFile.find(
      {
        users: mongoose.Types.ObjectId(user_id),
        role_files: {$in: role }
      });
console.log(authorities);
    const file_ids = authorities.filter( authority => (authority.files !== undefined)).map( authority => authority.files );

    return new Promise((resolve, reject) => resolve(file_ids) )

  })
}
