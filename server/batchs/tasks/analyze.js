import co from "co";
import { Types } from "mongoose";
import Tenant from "../../lib/models/Tenant";
import Dir from "../../lib/models/Dir";
import File from "../../lib/models/File";
import { logger } from "../index";

const task = () => {
  co(function* () {
    try {
      console.log("analyze start");

      // ごみ箱のファイルは集計対象外
      const trashDirs = yield Tenant.find({}, {trash_dir_id: 1});
      const trashDirIds = trashDirs.map( d => d.trash_dir_id );

      const debug = yield File.aggregate([
        {
          $match: {
            is_display: true,
            is_dir: false,
            is_deleted: false,
            dir_id: { $nin: trashDirIds }
          }
        },
        {
          $group: {
            _id: "$dir_id",
            totalSize: { $sum: "$size" },
            count: { $sum: 1 }
          }
        }
      ]);
      
    }
    catch (e) {
      console.log(e);
    }
    finally {
      console.log("analyze end");
      process.exit();
    }
  });
};

export default task;
