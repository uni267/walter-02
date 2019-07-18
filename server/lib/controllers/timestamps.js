import mongoose from "mongoose";
import File from "../models/File";
import FileMetaInfo from "../models/FileMetaInfo";
import MetaInfo from "../models/MetaInfo";
import Dir from "../models/Dir";
import Tenant from "../models/Tenant";

import esClient from "../elasticsearchclient";
import logger from "../logger";
import TsaApi from "../apis/tsaClient";
import { Swift } from "../storages/Swift";
import fs from "fs";
import util from "util";
import {
  ValidationError,
  RecordNotFoundException,
  PermisstionDeniedException
} from "../errors/AppError";

export const grantToken = async (req, res, next) => {
  try {
    const { file_id } = req.params;
    if ( file_id === null || file_id === undefined || file_id === "") throw new ValidationError( "file_id is empty" );
    if (! mongoose.Types.ObjectId.isValid(file_id)) throw new ValidationError( "file_id is invalid" );

    const meta_info = await grantTimestampToken(file_id, res.user.tenant._id)

    res.json({
      status: { success: true },
      body: { meta_info },
    });
  }
  catch (e) {
    logger.error(e)
    let errors = {};
    switch(e.message) {
      case "file_id is empty":
        errors.file_id = "ファイルIDが空です";
        break;
      case "file_id is invalid":
        errors.file_id = "ファイルIDが不正です";
        break;
      case "file is empty":
      case "file is deleted":
        errors.file_id = "指定されたファイルが存在ません";
        break;
      case "File is a kind of directory":
        errors.file_id = "対象がフォルダです";
        break;
      case "TSA authentication info is not found":
          errors.tsa_auth = "TSA認証情報が見つかりません";
          break;
      default:
        errors.unknown = e.message;
    }

    res.status(400).json({
      status: { success: false, message: "タイムスタンプの発行に失敗しました" , errors }
    });
  }
};

export const grantTimestampToken = async (file_id, tenant_id) => {
  try {
    let tsMetaInfo
    const tenant =  await Tenant.findById(tenant_id)
    if (!tenant) throw `Tenant ${tenant_id} is not found`
    if (!tenant.tsaAuth || !tenant.tsaAuth.user || !tenant.tsaAuth.pass) throw new ValidationError("TSA authentication info is not found")

    const file = await File.findById(file_id);
    if (!file) throw new ValidationError( "file is empty")
    if (file.is_deleted) throw new ValidationError( "file is deleted" );
    if (file.is_dir) throw new ValidationError("File is a kind of directory");

    const readStream = await new Swift().downloadFile(tenant.name, file);
    const encodedFile = await (new Promise((resolve, reject) => {
      let chunks = []
      readStream
        .on("data", chunk => chunks.push(chunk))
        .on("end", () => resolve(Buffer.concat(chunks).toString("base64")))
        .on("error", e => reject(e))
    }))

    const metaInfo = await MetaInfo.findOne({ name: "timestamp" })

    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })
    if (!fileMetaInfo) {
      fileMetaInfo = new FileMetaInfo({
        file_id: file._id,
        meta_info_id: metaInfo._id,
        value: [],
      })
    }

    let grantData
    const tsaApi = new TsaApi(tenant.tsaAuth.user, tenant.tsaAuth.pass)
    if (file.mime_type !== "application/pdf") {
      ({data: grantData} = await tsaApi.grantToken(file._id.toString(), encodedFile))

    } else {
      let ts_flg=false
      let verifresult=null
      try {
        verifresult = await tsaApi.verifyPades(file._id.toString(),encodedFile);
        if(verifresult.data.result.status === "Success"){
          ts_flg=true
        }
      } catch (e) {
      } finally {

      }
      if(ts_flg){
        ({data: grantData} = await tsaApi.grantaddLTV(file._id.toString(), encodedFile))
      }else{
        ({data: grantData} = await tsaApi.grantEst(file._id.toString(), encodedFile))
      }
    }
    if (grantData.timestampToken) {
      let verifyData
      if (file.mime_type !== "application/pdf") {
        ({data: verifyData} = await tsaApi.verifyToken(file._id.toString(), encodedFile, grantData.timestampToken.token))
      } else {
        ({data: verifyData} = await tsaApi.verifyPades(file._id.toString(), grantData.file))
      }
      fileMetaInfo.value = [...fileMetaInfo.value, { ...grantData.timestampToken, ...verifyData.result }]
      await fileMetaInfo.save()

      const updatedFile = await File.searchFileOne({_id: file._id})
      tsMetaInfo = updatedFile.meta_infos.find(m => m.name === metaInfo.name)
      if (!tsMetaInfo) throw "Failed to create timestamp meta info."
      await esClient.createIndex(tenant_id, [updatedFile]);
    }
    if(file.mime_type === "application/pdf"){
      try {
        await new Swift().upload(tenant.name, Buffer.from(grantData.file, 'base64'), file._id.toString());
        let update_info = await File.findById(file._id);
        let itemsize = Buffer.from(grantData.file, 'base64').length
        update_info.modified = Date.now()
        update_info.size = itemsize
        await update_info.save()
      }
      catch (e) {
        logger.error(e)
        throw "ファイル本体の保存に失敗しました"
      }
    }

    return tsMetaInfo
  }
  catch (e) {
    throw e
  }
}

export const verifyToken = async (req, res, next) => {
  try {
    const { file_id } = req.params;
    if ( file_id === null || file_id === undefined || file_id === "") throw new ValidationError( "file_id is empty" );
    if (! mongoose.Types.ObjectId.isValid(file_id)) throw new ValidationError( "file_id is invalid" );
    const file = await File.findById(file_id);
    if (file === null) throw new ValidationError( "file is empty" );
    if (file.is_deleted) throw new ValidationError( "file is deleted" );
    if (file.is_dir) throw new ValidationError( "File is a kind of directory");

    const tsaAuth = res.user.tenant.tsaAuth
    if (!tsaAuth || !tsaAuth.user || !tsaAuth.pass) throw new ValidationError("TSA authentication info is not found")

    const metaInfo = await MetaInfo.findOne({ name: "timestamp" })

    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })

    const tenant_name = res.user.tenant.name;
    const readStream = await new Swift().downloadFile(tenant_name, file);
    const encodedFile = await (new Promise((resolve, reject) => {
      let chunks = []
      readStream
      .on("data", chunk => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks).toString("base64")))
      .on("error", e => reject(e))
    }))
    const tsaApi = new TsaApi(tsaAuth.user, tsaAuth.pass)

    let inspectresult
    let timestamp
    if (!fileMetaInfo || fileMetaInfo.value.length === 0) {
      inspectresult = (await tsaApi.inspect( file._id.toString(), encodedFile )).data;
      if(!inspectresult.hasToken){
        throw new ValidationError("The file does not have timestamp token")
      }
      timestamp = inspectresult.timestampToken;
    }else{
      timestamp = fileMetaInfo.value[fileMetaInfo.value.length - 1] ;
    }

    let verifyData
    if (file.mime_type !== "application/pdf") {
      ({data: verifyData} = await tsaApi.verifyToken(file._id.toString(), encodedFile, timestamp.token))
    }
    else {
      ({data: verifyData} = await tsaApi.verifyPades(file._id.toString(), encodedFile))
    }
    if (!fileMetaInfo || fileMetaInfo.value.length === 0) {
      fileMetaInfo = new FileMetaInfo({
        file_id: file._id,
        meta_info_id: metaInfo._id,
      })
      fileMetaInfo.value=[{
        ...timestamp,
        ...verifyData.result
      }];
      await fileMetaInfo.save();
    }else{
      await fileMetaInfo.update({
        $set: {
          [`value.${fileMetaInfo.value.length - 1}`]: {
            ...timestamp,
            ...verifyData.result,
          }
        }
      })
    }
    const updatedFile = await File.searchFileOne({_id: file._id})
    const tsMetaInfo = updatedFile.meta_infos.find(m => m.name === metaInfo.name)
    if (!tsMetaInfo) throw new ValidationError("Failed to create timestamp meta info.")

    await esClient.createIndex(res.user.tenant._id, [updatedFile]);

    res.json({
      status: { success: true },
      body: {
        meta_info: tsMetaInfo
      }
    });
  }
  catch (e) {
    logger.error(e)
    let errors = {};

    switch(e.message) {
      case "file_id is empty":
        errors.file_id = "ファイルIDが空です";
        break;
      case "file_id is invalid":
        errors.file_id = "ファイルIDが不正です";
        break;
      case "file is empty":
      case "file is deleted":
        errors.file_id = "指定されたファイルが存在しません";
        break;
      case "File is a kind of directory":
        errors.file_id = "対象がフォルダです";
        break;
      case "TSA authentication info is not found":
        errors.tsa_auth = "TSA認証情報が見つかりません";
        break;
      case "The file does not have timestamp token":
        errors.file_id = "ファイルにタイムスタンプが付与されていません";
        break;
      case "Failed to create timestamp meta info.":
        errors.verify = "タイムスタンプ検証情報の生成に失敗しました";
        break;
      default:
        errors.unknown = e;
    }

    switch (e) {
    case "file_id is empty":
      errors.file_id = e;
      break;
    default:
      break;
    }
    res.status(400).json({
      status: { success: false, message: "タイムスタンプの検証に失敗しました", errors }
    });
  }
};

export const downloadToken = async (req, res, next) => {
  try {
    const { file_id }  = req.query;

    if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

    const file = await File.findById(file_id);
    if (file.is_dir) throw "it's not a file";

    const metaInfo = await MetaInfo.findOne({ name: "timestamp" })
    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })
    if (!fileMetaInfo) throw new Error("File meta info for timestamp is not found")
    const timestamp = fileMetaInfo.value[fileMetaInfo.value.length-1]

    const contents = Buffer.from(timestamp.token, "base64");
    const tmpFilePath = '/tmp/ts_token_of_'+file_id
    fs.writeFile(tmpFilePath, contents, function() {
      const readStream = fs.createReadStream(tmpFilePath)
      readStream.on("data", data => res.write(data) );
      readStream.on("end", () => res.end() );
    });
  }
  catch (e) {
    logger.error(e)
    let errors = {};
    switch (e) {
    case "file_id is empty":
      errors.file_id = e;
      break;
    default:
      break;
    }
    res.status(400).json({
      status: { success: false, message: "タイムスタンプトークンのダウンロードに失敗しました", errors }
    });
  }
}

export const enableAutoGrantToken = async (req, res, next) => {
  try {
    const { file_id } = req.params;

    if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

    const file = await File.findById(file_id);
    if (!file.is_dir) throw "it's not a directory";

    const metaInfo = await MetaInfo.findOne({ name: "auto_grant_timestamp" })

    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })
    if (!fileMetaInfo) {
      fileMetaInfo = new FileMetaInfo({
        file_id: file._id,
        meta_info_id: metaInfo._id,
      })
    }
    fileMetaInfo.value = true
    await fileMetaInfo.save()

    // サブディレクトリを取得
    const dirs = await findAllDescendants(file._id)

    await Promise.all(dirs.map(async dir => {
      let fileMetaInfo = await FileMetaInfo.findOne({ file_id: dir.file._id, meta_info_id: metaInfo._id })
      if (!fileMetaInfo) {
        fileMetaInfo = new FileMetaInfo({
          file_id: dir.file._id,
          meta_info_id: metaInfo._id,
        })
      }
      fileMetaInfo.value = true
      return await fileMetaInfo.save()
    }))

    const updatedFile = await File.searchFileOne({_id: file._id})
    const autoGrantTsInfo = updatedFile.meta_infos.find(m => m.name === metaInfo.name)

    res.json({
      status: { success: true },
      body: {
        meta_info: autoGrantTsInfo
      }
    });
  }
  catch (e) {
    logger.error(e)
    let errors = {};
    switch (e) {
    case "file_id is empty":
      errors.file_id = e;
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

export const disableAutoGrantToken = async (req, res, next) => {
  try {
    const { file_id } = req.params;

    if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

    const file = await File.findById(file_id);
    if (!file.is_dir) throw "it's not a directory";

    const metaInfo = await MetaInfo.findOne({ name: "auto_grant_timestamp" })

    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })
    if (!fileMetaInfo) {
      fileMetaInfo = new FileMetaInfo({
        file_id: file._id,
        meta_info_id: metaInfo._id,
      })
    }
    fileMetaInfo.value = false
    await fileMetaInfo.save()

    // サブディレクトリを取得
    const dirs = await findAllDescendants(file._id)
    await Promise.all(dirs.map(async dir => {
      let fileMetaInfo = await FileMetaInfo.findOne({ file_id: dir.file._id, meta_info_id: metaInfo._id })
      if (!fileMetaInfo) {
        fileMetaInfo = new FileMetaInfo({
          file_id: dir.file._id,
          meta_info_id: metaInfo._id,
        })
      }
      fileMetaInfo.value = false
      return await fileMetaInfo.save()
    }))

    const updatedFile = await File.searchFileOne({_id: file._id})
    const autoGrantTsInfo = updatedFile.meta_infos.find(m => m.name === metaInfo.name)

    res.json({
      status: { success: true },
      body: {
        meta_info: autoGrantTsInfo
      }
    });
  }
  catch (e) {
    logger.error(e)
    let errors = {};
    switch (e) {
    case "file_id is empty":
      errors.file_id = e;
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

export const _aggregateMetaInfo = async (file_id, meta_info_name) => {
  return await FileMetaInfo.aggregate([
    { $match: { file_id }},
    {
      $lookup: {
        from: "meta_infos",
        localField: "meta_info_id",
        foreignField: "_id",
        as: "meta_info"
      }
    },
    {
      $unwind: {
        path: "$meta_info",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: { "meta_info.name": meta_info_name }
    },
    {
      $project: {
        id: "$meta_info._id",
        label: "$meta_info.label",
        name: "$meta_info.name",
        meta_info_id: "$meta_info_id",
        label: "$meta_info.label",
        sort_target: null,
        value: "$value",
        value_type: "$meta_info.value_type",
      }
    }
  ]).then(items => items[0]);
}

const findAllDescendants = async file_id => {
  return await Dir.aggregate([
    { $match: { ancestor: file_id, depth: { $gt: 0 }}},
    {
      $lookup: {
        from: "files",
        localField: "descendant",
        foreignField: "_id",
        as: "file"
      }
    },
    {
      $unwind: {
        path: "$file",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
}
