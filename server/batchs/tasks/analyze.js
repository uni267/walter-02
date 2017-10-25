import co from "co";
import { Types } from "mongoose";
import moment from "moment";
import util from "util";

// logger
import { logger } from "../index";

// models
import Tenant from "../../lib/models/Tenant";
import Dir from "../../lib/models/Dir";
import File from "../../lib/models/File";
import Tag from "../../lib/models/Tag";
import AnalysisUseRateTotal from "../../lib/models/AnalysisUseRateTotal";
import AnalysisFileCount from "../../lib/models/AnalysisFileCount";
import AnalysisFolderCount from "../../lib/models/AnalysisFolderCount";
import AnalysisUseRateFolder from "../../lib/models/AnalysisUseRateFolder";
import AnalysisUseRateTag from "../../lib/models/AnalysisUseRateTag";
import AnalysisUseRateMimeType from "../../lib/models/AnalysisUseRateMimeType";

const task = () => {
  co(function* () {
    try {
      console.log("################# analyze start #################");

      // 使用率、ファイル数、フォルダ数
      const fileFolderCounts = yield File.aggregate([
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
            used: { $sum: "$size" },
            fileCount: { $sum: 1 }
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
        { $unwind: "$dirs" },
        {
          $lookup: {
            from: "tenants",
            localField: "dirs.ancestor",
            foreignField: "home_dir_id",
            as: "tenants"
          }
        },
        {
          $match: { tenants: { $ne: [] } }
        },
        {
          $project: {
            _id: 0,
            dir_id: "$_id",
            used: 1,
            fileCount: 1,
            tenant: { $arrayElemAt: [ "$tenants", 0 ] }
          }
        },
        {
          // テナントidで畳みこみ
          $group: {
            _id: "$tenant._id",
            tenantId: { $first: "$tenant._id" },
            tenantName: { $first: "$tenant.name" },
            threshold: { $first: "$tenant.threshold" },
            used: { $sum: "$used" },
            fileCount: { $sum: "$fileCount" },
            folderCount: { $sum: 1 }
          }
        }
      ]);

      // debug
      // console.log(util.inspect(fileFolderCounts, false, null));
      // debug

      // 2重集計防止
      yield AnalysisUseRateTotal.remove({
        reported_at: parseInt(moment().format("YYYYMMDD"), 10)
      });

      // 使用率保存
      yield AnalysisUseRateTotal.insertMany(
        fileFolderCounts.map( f => ({
          reported_at: parseInt(moment().format("YYYYMMDD"), 10),
          tenant_id: Types.ObjectId(f.tenantId),
          name: "useRateTotal",
          label: "全体の使用率",
          threshold: f.threshold,
          used: f.used,
          free: f.threshold - f.used,
          used_rate: f.used / f.threshold * 100
        }))
      );

      // 2重集計防止
      yield AnalysisFileCount.remove({
        reported_at: parseInt(moment().format("YYYYMMDD"), 10)
      });

      // ファイル数保存
      yield AnalysisFileCount.insertMany(
        fileFolderCounts.map( f => ({
          reported_at: parseInt(moment().format("YYYYMMDD"), 10),
          tenant_id: Types.ObjectId(f.tenantId),
          name: "fileCount",
          label: "ファイル数合計",
          count: f.fileCount
        }))
      );
        
      // 2重集計防止
      yield AnalysisFolderCount.remove({
        reported_at: parseInt(moment().format("YYYYMMDD"), 10)
      });

      // フォルダ数保存
      yield AnalysisFolderCount.insertMany(
        fileFolderCounts.map ( f => ({
          reported_at: parseInt(moment().format("YYYYMMDD"), 10),
          tenant_id: Types.ObjectId(f.tenantId),
          name: "folderCount",
          label: "フォルダ数合計",
          count: f.folderCount
        }))
      );

      // フォルダ毎の使用率
      const folderRatesConditions = [
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
            dir_id: { $first: "$dir_id" },
            used: { $sum: "$size" }
          }
        },
        {
          $lookup: {
            from: "dirs",
            localField: "dir_id",
            foreignField: "descendant",
            as: "dirs"
          }
        },
        { $unwind: "$dirs" },
        {
          $lookup: {
            from: "tenants",
            localField: "dirs.ancestor",
            foreignField: "home_dir_id",
            as: "tenants"
          }
        },
        {
          $match: { tenants: { $ne: [] } }
        },
        {
          $lookup: {
            from: "files",
            localField: "dir_id",
            foreignField: "_id",
            as: "dir"
          }
        },
        {
          $project: {
            _id: 0,
            dir_id: 1,
            used: 1,
            dir_name: { $arrayElemAt: [ "$dir.name", 0 ] },
            tenant_id: { $arrayElemAt: [ "$tenants._id", 0 ] }
          }
        },
        {
          $sort: { tenant_id: 1, used: -1}
        }
      ];

      const folderRates = yield File.aggregate(folderRatesConditions);

      // debug
      // console.log(util.inspect(folderRates, false, null));
      // debug      

      const folderRatesSum = yield File.aggregate([
        ...folderRatesConditions,
        {
          $group: {
            _id: "$tenant_id",
            tenant_id: { $first: "$tenant_id" },
            usedTotal: { $sum: "$used" }
          }
        },
        {
          $project: {
            _id: 0,
            tenant_id: 1,
            usedTotal: 1
          }
        }
      ]);

      yield AnalysisUseRateFolder.remove({
        reported_at: parseInt( moment().format("YYYYMMDD"), 10 )        
      });

      const folderRatesCombined = folderRates.map( f => {
        const sum = folderRatesSum.filter( sum => (
          sum.tenant_id.toString() === f.tenant_id.toString()
        ));
        f.usedTotal = sum[0].usedTotal;
        return f;
      });

      yield AnalysisUseRateFolder.insertMany(
        folderRatesCombined.map( r => ({
          reported_at: parseInt( moment().format("YYYYMMDD"), 10 ),
          tenant_id: Types.ObjectId(r.tenantId),
          name: "useRateFolder",
          label: "フォルダ毎の使用率",
          dir_name: r.dir_name,
          used: r.used,
          used_total: r.usedTotal,
          rate: r.used / r.usedTotal * 100
        }))
      );

      // ユーザ、グループ毎の使用率
      // @todo 権限周りが固まってから着手する
      // const userGroupPropotions = yield File.aggregate([
      // ]);


      // タグ毎の使用率 ここから
      const tagRatesConditions = [
        {
          $match: {
            is_display: true,
            is_dir: false,
            is_deleted: false
          }
        },
        {
          $project: {
            dir_id: 1,
            size: 1,
            name: 1,
            tags: 1
          }
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
          }
        },
        {
          // 「タグなし」も集計に含めるので
          $unwind: {
            path: "$tags",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "dirs",
            localField: "dir_id",
            foreignField: "descendant",
            as: "dirs"
          }
        },
        { $unwind: "$dirs" },
        {
          $lookup: {
            from: "tenants",
            localField: "dirs.ancestor",
            foreignField: "home_dir_id",
            as: "tenants"
          }
        },
        {
          $match: { tenants: { $ne: [] } }
        },
        {
          $project: {
            used: "$size",
            tenant_id: { $arrayElemAt: [ "$tenants._id", 0 ] },
            tag_id: "$tags._id",
            tag_label: "$tags.label"
          }
        },
        {
          $group: {
            _id: { tenant_id: "$tenant_id", tag_id: "$tag_id" },
            tenant_id: { $first: "$tenant_id" },
            used: { $sum: "$used" },
            count: { $sum: 1 },
            tag_id: { $first: "$tag_id" },
            tag_label: { $first: "$tag_label" }
          }
        }
      ];

      const tagRates = yield File.aggregate(tagRatesConditions);

      const tagRatesGroupByTenants = yield File.aggregate([
        ...tagRatesConditions,
        {
          $group: {
            _id: "$tenant_id",
            tenant_id: { $first: "$tenant_id" },
            used_total: { $sum: "$used" },
            count: { $sum: "$count" }
          }
        }
      ]);

      // debug
      // console.log(util.inspect(tagRates, false, null));
      // console.log(util.inspect(tagRatesGroupByTenants, false, null));
      // debug

      yield AnalysisUseRateTag.remove({
        reported_at: parseInt(moment().format("YYYYMMDD"), 10)
      });

      const tagRatesCombined = tagRates.map( t => {
        const sum = tagRatesGroupByTenants.filter( sum => (
          sum.tenant_id.toString() === t.tenant_id.toString()
        ));
        t.used_total = sum[0].used_total;
        return t;
      });

      // console.log(util.inspect(tagRatesCombined, false, null));

      yield AnalysisUseRateTag.insertMany(
        tagRatesCombined.map( t => ({
          reported_at: parseInt( moment().format("YYYYMMDD"), 10 ),
          tenant_id: Types.ObjectId(t.tenant_id),
          name: "useRateTag",
          label: "タグ毎の使用率",
          tag_id: Types.ObjectId(t.tag_id),
          tag_label: t.tag_label,
          used: t.used,
          count: t.count,
          used_total: t.used_total,
          rate: t.used / t.used_total * 100
        }))
      );

      // mime毎の使用率 ここから
      const mimeRatesConditions = [
        {
          $match: {
            is_display: true,
            is_dir: false,
            is_deleted: false
          }
        },
        {
          $project: {
            size: 1,
            dir_id: 1,
            mime_type: 1
          }
        },
        {
          $lookup: {
            from: "dirs",
            localField: "dir_id",
            foreignField: "descendant",
            as: "dirs"
          }
        },
        { $unwind: "$dirs" },
        {
          $lookup: {
            from: "tenants",
            localField: "dirs.ancestor",
            foreignField: "home_dir_id",
            as: "tenants"
          }
        },
        {
          $match: { tenants: { $ne: [] } }
        },
        {
          $project: {
            _id: 0,
            used: "$size",
            tenant_id: { $arrayElemAt: [ "$tenants._id", 0 ] },
            mime_type: "$mime_type"
          }
        },
        {
          $group: {
            _id: { tenant_id: "$tenant_id", mime_type: "$mime_type" },
            tenant_id: { $first: "$tenant_id" },
            used: { $sum: "$used" },
            count: { $sum: 1 },
            mime_type: { $first: "$mime_type" }
          }
        }
      ];

      const mimeRates = yield File.aggregate(mimeRatesConditions);
      const mimeRatesGroupByTenants = yield File.aggregate([
        ...mimeRatesConditions,
        {
          $group: {
            _id: "$tenant_id",
            tenant_id: { $first: "$tenant_id" },
            used_total: { $sum: "$used" },
            count_total: { $sum: "$count" }
          }
        }
      ]);

      // console.log(util.inspect(mimeRates, false, null));
      // console.log(util.inspect(mimeRatesGroupByTenants, false, null));

      const mimeRatesCombined = mimeRates.map( m => {
        const sum = mimeRatesGroupByTenants.filter( sum => (
          sum.tenant_id.toString() === m.tenant_id.toString()
        ));
        m.used_total = sum[0].used_total;
        m.count_total = sum[0].count_total;
        return m;
      });

      // console.log(util.inspect(mimeRatesCombined, false, null));

      yield AnalysisUseRateMimeType.remove({
        reported_at: parseInt(moment().format("YYYYMMDD"), 10)
      });

      yield AnalysisUseRateMimeType.insertMany(
        mimeRatesCombined.map( m => ({
          reported_at: parseInt( moment().format("YYYYMMDD"), 10 ),
          tenant_id: Types.ObjectId(m.tenant_id),
          name: "useRateMimeType",
          label: "mime-type毎の使用率",
          mime_type: m.mime_type,
          used: m.used,
          used_total: m.used_total,
          count: m.count,
          count_total: m.count_total,
          rate: m.used / m.used_total * 100
        }))
      );

    }
    catch (e) {
      console.log(e);
      process.exit();
    }
    finally {
      console.log("################# analyze end #####################");
      process.exit();
    }
  });
};

export default task;
