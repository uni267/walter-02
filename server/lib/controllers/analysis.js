import co from "co";
import util from "util";
import mongoose from "mongoose";
import moment from "moment";

import AnalysisUseRateTotal from "../models/AnalysisUseRateTotal";
import AnalysisFileCount from "../models/AnalysisFileCount";
import AnalysisFolderCount from "../models/AnalysisFolderCount";
import AnalysisUseRateFolder from "../models/AnalysisUseRateFolder";
import AnalysisUseRateTag from "../models/AnalysisUseRateTag";
import AnalysisUseRateMimeType from "../models/AnalysisUseRateMimeType";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const { reported_at } = req.query;
      let conditions = {
        tenant_id: res.user.tenant_id
      };

      if (reported_at === null || reported_at === undefined || reported_at === "") {
        conditions.reported_at = moment().format("YYYYMMDD");
      } else {
        conditions.reported_at = reported_at;
      }

      let [
        useRateTotal,
        fileCount,
        folderCount,
        useRateFolder,
        useRateTag,
        useRateMimeType
      ] = yield [
        AnalysisUseRateTotal.find(conditions),
        AnalysisFileCount.find(conditions),
        AnalysisFolderCount.find(conditions),
        AnalysisUseRateFolder.find(conditions),
        AnalysisUseRateTag.find(conditions),
        AnalysisUseRateMimeType.find(conditions)
      ];

      useRateTotal = [
        { name: "usage", label: "使用容量", value: useRateTotal[0].used },
        { name: "free", label: "空き容量", value: useRateTotal[0].free }
      ];

      fileCount = [{
        name: "fileCount", value: fileCount[0].count
      }];

      folderCount = [{
        name: "folderCount", value: folderCount[0].count
      }];

      useRateFolder = useRateFolder.map( f => ({
        name: f.dir_name, value: f.rate
      }));

      useRateTag = useRateTag.map( t => {
        if (t.tag_label === null) {
          t.tag_label = "タグなし";
        }
        return { name: t.tag_label, value: t.rate };
      });

      useRateMimeType = useRateMimeType.map( m => ({
        name: m.mime_type, value: m.rate
      }));

      res.json({
        status: { success: true },
        body: {
          useRateTotal,
          fileCount,
          folderCount,
          useRateFolder,
          useRateTag,
          useRateMimeType
        }
      });
    }
    catch (e) {
      console.log(e);

      let errors = {};
      errors.unknown = e;

      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
};


