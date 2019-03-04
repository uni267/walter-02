import File from "../models/File";
import FileMetaInfo from "../models/FileMetaInfo";
import MetaInfo from "../models/MetaInfo";

import logger from "../logger";
import api from "../apis/timestamp";
import { Swift } from "../storages/Swift";

export const grantToken = async (req, res, next) => {
    try {
      const { file_id } = req.params;

      if (file_id === undefined ||
          file_id === null ||
          file_id === "") throw "file_id is empty";

      const file = await File.findById(file_id);
      if (file.is_dir) throw "it's a directory";

      const tenant_name = res.user.tenant.name;
      const readStream = await new Swift().downloadFile(tenant_name, file);
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

      let data = null
      if (file.mime_type !== "application/pdf") {
        data = await api.grantToken(file._id.toString(), encodedFile)
      }
      else {
        data = await api.grantPades(file._id.toString(), encodedFile)
        try {
          await new Swift().upload(tenant_name, Buffer.from(data.file, 'base64'), file._id.toString());
        }
        catch (e) {
          console.log(e)
          throw "ファイル本体の保存に失敗しました"
        }
      }

      if (data.timestamp) {
        await fileMetaInfo.update({ $push: { value: data.timestamp }})
        fileMetaInfo = await FileMetaInfo.findById(fileMetaInfo._id)
      }

      res.json({
        status: { success: true },
        body: { fileMetaInfo }
      });
    }
    catch (e) {
      console.error(e)
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

export const verifyToken = async (req, res, next) => {
  try {
    const { file_id } = req.params;

    if (file_id === undefined ||
        file_id === null ||
        file_id === "") throw "file_id is empty";

    const file = await File.findById(file_id);
    if (file.is_dir) throw "it's a directory";

    const metaInfo = await MetaInfo.findOne({ name: "timestamp" })

    let fileMetaInfo = await FileMetaInfo.findOne({ file_id: file._id, meta_info_id: metaInfo._id })
    if (!fileMetaInfo || fileMetaInfo.value.length === 0) throw "The file does not have timestamp token"

    const tenant_name = res.user.tenant.name;
    const readStream = await new Swift().downloadFile(tenant_name, file);
    const encodedFile = await (new Promise((resolve, reject) => {
      let chunks = []
      readStream
        .on("data", chunk => chunks.push(chunk))
        .on("end", () => resolve(Buffer.concat(chunks).toString("base64")))
        .on("error", e => reject(e))
    }))

    const timestamp = fileMetaInfo.value[fileMetaInfo.value.length - 1]

    let data = null
    if (file.mime_type !== "application/pdf") {
      data = await api.verifyToken(file._id.toString(), encodedFile, timestamp.token)
    }
    else {
      data = await api.verifyPades(file._id.toString(), encodedFile, timestamp.token)
    }

    await fileMetaInfo.update({
      $set: {
        [`value.${fileMetaInfo.value.length - 1}`]: {
          ...timestamp,
          ...data.result,
        }
      }
    })

    res.json({
      status: { success: true },
      body: {
        result: data.result
      }
    });
  }
  catch (e) {
    console.error(e)
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

    res.json({
      status: { success: true },
    });
  }
  catch (e) {
    console.error(e)
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
    if (fileMetaInfo) {
      fileMetaInfo.value = false
      await fileMetaInfo.save()
    }

    res.json({
      status: { success: true },
    });
  }
  catch (e) {
    console.error(e)
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
