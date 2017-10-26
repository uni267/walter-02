import mongoose, { Schema } from "mongoose";
import co from "co";
import { logger } from "../index";

import User from "./User";
import RoleFile from "./RoleFile";

mongoose.Promise = global.Promise;

const FileSchema = Schema({
  name: String,
  blob_path: String,
  mime_type: String,
  size: Number,
  modified: { type: Date, default: Date.now },
  is_dir: Boolean,
  dir_id: Schema.Types.ObjectId,
  is_display: Boolean,
  is_star: Boolean,
  is_deleted: {type:Boolean, default: false}, // 完全削除フラグ。ゴミ箱移動時はfalseのまま
  tags: Array,
  histories: Array,
  authority_files: [{ type:Schema.Types.ObjectId, ref:'authority_files'}],
  meta_infos: Array,
  preview_id: Schema.Types.ObjectId,
  is_crypted: {type:Boolean, default: false}
});

FileSchema.statics.searchFiles = function(conditions,offset,limit,sortOption){
  const _this = this;
  return co(function* (){
    try {
      let files = yield _this.aggregate([
        { $match: conditions },
        { $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }},
        { $lookup: {
          from: "dirs",
          localField: "dir_id",
          foreignField: "descendant",
          as: "dirs"
        }},
        { $lookup:{
          from: "authority_files",
          localField: "authority_files",
          foreignField: "_id",
          as: "authorities"
        }},
        { $project:{
          _id: 1,
          is_star: 1,
          is_display: 1,
          dir_id: 1,
          is_dir: 1,
          size: 1,
          mime_type: 1,
          name: 1,
          is_crypted: 1,
          meta_infos: 1,
          histories: 1,
          tags: 1,
          is_deleted: 1,
          modified: 1,
          __v: 1,
          preview_id: 1,
          dirs: 1,
          authorities: 1,
        }},
      ]).skip(offset).limit(limit).sort(sortOption);

      files = yield File.populate(files,{ path:'authorities.users', model: User } );

      files = yield File.populate(files,{ path:'authorities.role_files', model: RoleFile } );

      return yield File.populate(files,'dirs.ancestor');

    } catch (error) {
      throw error
    }
  })
}

FileSchema.statics.searchFileOne = function(conditions){
  const _this = this;
  return co(function* (){
    try {
      const offset = 0;
      const limit = 1;
      const sortOption = { _id: 1};
      const files = yield _this.searchFiles(conditions,offset,limit,sortOption);

      return new Promise( (resolve,reject) => resolve(files[0]) );
    } catch (error) {
      throw error
    }
  });

}

const File = mongoose.model("files", FileSchema, "files");

export default File;
