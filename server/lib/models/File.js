import mongoose, { Schema } from "mongoose";
import co from "co";
import { logger } from "../index";

import User from "./User";
import Group from "./Group";
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
  preview_id: Schema.Types.ObjectId,
  is_crypted: {type:Boolean, default: false}
});

FileSchema.statics.searchFiles = function(conditions,offset,limit,sortOption){
  const _this = this;
  return co(function* (){
    try {
console.log(conditions,offset,limit,sortOption);
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
          localField: "_id",
          foreignField: "files",
          as: "authorities"
        }},
        { $lookup: {
          from: "file_meta_infos",
          localField: "_id",
          foreignField: "file_id",
          as: "meta_infos"
        }},
        { $unwind: {
          path: "$meta_infos",
          preserveNullAndEmptyArrays: true
        }},
        { $lookup: {
          from: "meta_infos",
          localField: "meta_infos.meta_info_id",
          foreignField: "_id",
          as: "meta_info"
        }},
        { $unwind: {
          path: "$meta_info",
          preserveNullAndEmptyArrays: true
        }},
        { $group: {
          _id: "$_id",
          name: { $first: "$name" },
          mime_type: { $first: "$mime_type" },
          size: { $first: "$size" },
          is_dir: { $first: "$is_dir" },
          dir_id: { $first: "$dir_id" },
          is_display: { $first: "$is_display" },
          is_star: { $first: "$is_star" },
          is_crypted: { $first: "$is_crypted" },
          histories: { $first: "$histories" },
          tags: { $first: "$tags" },
          is_deleted: { $first: "$is_deleted" },
          modified: { $first: "$modified" },
          dirs: { $first: "$dirs" },
          authorities: { $first: "$authorities" },
          meta_infos: {
            $push: {
              _id: "$meta_info._id",
              key: "$meta_info.key",
              key_type: "$meta_info.key_type",
              value_type: "$meta_info.value_type",
              value: "$meta_infos.value"
            }
          }
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
          preview_id: 1,
          dirs: 1,
          authorities: 1
        }},
      ]).skip(offset).limit(limit).sort(sortOption);
console.log("files =>",files);
      files = yield File.populate(files,{ path:'authorities.users', model: User } );
      files = yield File.populate(files,{ path:'authorities.groups', model: Group } );
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
console.log(conditions,offset,limit,sortOption);
      const files = yield _this.searchFiles(conditions,offset,limit,sortOption);

      return new Promise( (resolve,reject) => resolve(files[0]) );
    } catch (error) {
      throw error
    }
  });

}

const File = mongoose.model("files", FileSchema, "files");

export default File;
