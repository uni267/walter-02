import mongoose from "mongoose";
import co from "co";

// etc
import esClient from "../elasticsearchclient";
import logger from "../logger";
import {
  ValidationError,
  RecordNotFoundException,
  PermisstionDeniedException
} from "../errors/AppError";
import * as commons from "./commons";
import * as constants from "../../configs/constants";

// models
import File from "../models/File";

// controllers
import * as filesController from "./files";


export const reIndex = (req, res, next) => {
  co(function* () {
    try {

      const params = req.body;

      const sortOption = { _id: "asc" };
      const targetIds = params._id.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => mongoose.Types.ObjectId(id));
      if(targetIds.length === 0) throw new ValidationError("Error");

      // mongoからデータを取得
      const conditions = { _id: { $in:targetIds } };
      const files = yield File.searchFiles(conditions, 0, constants.FILE_LIMITS_PER_PAGE, sortOption);
      if(files.length === 0) throw new RecordNotFoundException("record not found");

      // elasticsearchのインデックス更新
      const { tenant_id }= res.user;
      const result = yield esClient.createIndex(tenant_id, files);

      res.json({
        status: { success: true },
        body: result
      });

    } catch (e) {
      let errors = {};

      switch (e.name) {
        case "Error":
          errors = commons.errorParser(e);
          break;
        case "record not found":
          errors = commons.errorParser(e);
          break;
        default:
          errors.unknown = e;
          break;
      }
      logger.error(errors);

      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
};

export const reIndexSearchResult = (req, res, next) => {
  co(function* () {
    try {
      // 検索
      const files = yield filesController.searchDetail(req, res, next, true);

      if(files.length === 0) throw new RecordNotFoundException("record not found");

      // elasticsearchのインデックス更新
      const { tenant_id }= res.user;
      const result = yield esClient.createIndex(tenant_id, files);

      res.json({
        status: { success: true },
        body: result
      });

    } catch (e) {
      let errors = {};

      switch (e.name) {
        case "Error":
          errors = commons.errorParser(e);
          break;
        case "record not found":
          errors = commons.errorParser(e);
          break;
        default:
          errors.unknown = e;
          break;
      }
      logger.error(errors);

      res.status(400).json({
        status: { success: false, errors }
      });
    }

  });
};