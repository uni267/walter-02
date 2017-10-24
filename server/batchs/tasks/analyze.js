import co from "co";
import { Types } from "mongoose";
import moment from "moment";

import Tenant from "../../lib/models/Tenant";
import Dir from "../../lib/models/Dir";
import File from "../../lib/models/File";
import AnalysisSummary from "../../lib/models/AnalysisSummary";
import { logger } from "../index";
import util from "util";

const task = () => {
  co(function* () {
    try {
      console.log("analyze start");

      // 使用率、ファイル数、フォルダ数
      const fileFolderCounts = yield File.aggregate([
        ...groupByDirIdCondition(),
        {
          // テナントidで畳みこみ
          $group: {
            _id: "$tenants._id",
            tenantName: { $first: "$tenants.name" },
            threshold: { $first: "$tenants.threshold" },
            totalSize: { $sum: "$totalSize" },
            fileCount: { $sum: "$fileCount" },
            folderCount: { $sum: 1 }
          }
        }
      ]);

      // debug
      console.log(util.inspect(fileFolderCounts, false, null));
      // debug

      const fileCounts = fileFolderCounts.map( f => {
        const summary = new AnalysisSummary();
        summary.tenant_id = Types.ObjectId(f._id);
        summary.name = "fileCount";
        summary.label = "ファイル数";
        summary.value = f.fileCount;
        return summary;
      });

      // const fileCountsResult = yield AnalysisSummary.insertMany(fileCounts);

      const folderCounts = fileFolderCounts.map( f => {
        const summary = new AnalysisSummary();
        summary.tenant_id = Types.ObjectId(f._id);
        summary.name = "folderCount";
        summary.label = "フォルダ数";
        summary.value = f.folderCount;
        return summary;
      });

      // const folderCountsResult = yield AnalysisSummary.insertMany(folderCounts);

      const tenantsTotalUses = fileFolderCounts.map( f => {
        const summary = new AnalysisSummary();
        summary.tenant_id = Types.ObjectId(f._id);
        summary.name = "totalUse";
        summary.label = "使用量";
        summary.value = f.totalSize;
        return summary;
      });

      // const tenantsTotalUsesResult = yield AnalysisSummary.insertMany(tenantsTotalUses);

      const tenantsUseRates = fileFolderCounts.map( f => {
        const summary = new AnalysisSummary();
        summary.tenant_id = Types.ObjectId(f._id);
        summary.name = "useRate";
        summary.label = "使用率";
        summary.value = f.totalSize / f.threshold * 100;
        return summary;
      });

      // const tenantsUseRatesResult = yield AnalysisSummary.insertMany(tenantsUseRates);

      // フォルダ毎の使用率
      const folderPropotions = yield File.aggregate([
        ...groupByDirIdCondition(),
        {
          $lookup: {
            from: "analysis_summaries",
            localField: "tenants._id",
            foreignField: "tenant_id",
            as: "summaries"
          }
        },
        {
          $project: {
            _id: 1,
            totalSize: 1,
            tenants: 1,
            summaries: {
              $filter: {
                input: "$summaries",
                as: "summaries_alias",
                cond: {
                  $and: [
                    { $eq: [ "$$summaries_alias.name", "totalUse" ] },
                    { $gt: [
                      "$$summaries_alias.created_at",
                      moment().format("YYYY-MM-DD")
                    ]}
                  ]
                }
              }
            }
          }
        },
        {
          $unwind: "$summaries"
        },
        {
          $sort: {
            "tenants._id": 1,
            totalSize: 1
          }
        }
      ]);

      console.log(util.inspect(folderPropotions, false, null));
      
      const folderPropotionsSummary = folderPropotions.map( f => {
        const summary = new AnalysisSummary();
        summary.tenant_id = Types.ObjectId(f._id);
        summary.name = "folderPropotions";
        summary.label = "フォルダ毎の使用率";
        summary.value = f.totalSize / f.summaries.value * 100;
        return summary;
      });

      // const folderPropotionsResult = yield AnalysisSummary.insertMany(
      //   folderPropotionsSummary
      // );

      // ユーザ、グループ毎の使用率
      // @todo 権限周りが固まってから着手する
      // const userGroupPropotions = yield File.aggregate([
      //   {
      //     $match: {
      //       is_display: true,
      //       is_dir: false,
      //       is_deleted: false
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "authorities",
      //       localField: "authorities",
      //       foreignField: "_id",
      //       as: "authority"
      //     }
      //   },
      //   {
      //     $project: {
      //       name: 1,
      //       size: 1,
      //       authority: 1
      //     }
      //   }
      // ]);


      // タグ毎の使用率
      const tagPropotions = yield File.aggregate([
        ...groupByDirIdCondition()
      ]);

      console.log(util.inspect(tagPropotions, false, null));
    }
    catch (e) {
      console.log(e);
      process.exit();
    }
    finally {
      console.log("analyze end");
      process.exit();
    }
  });
};

const groupByDirIdCondition = () => {
  return [
    {
      $match: {
        is_display: true,
        is_dir: false,
        is_deleted: false
      }
    },
    {
      $group: {
        _id: "$dir_id",
        totalSize: { $sum: "$size" }
      }
    },
    {
      $lookup: {
        from: "dirs",
        localField: "_id",
        foreignField: "descendant",
        as: "dirs"
      }
    },
    {
      $lookup: {
        from: "tenants",
        localField: "dirs.ancestor",
        foreignField: "home_dir_id",
        as: "tenants"
      }
    },
    {
      $unwind: "$tenants"
    }
  ];
};

export default task;
