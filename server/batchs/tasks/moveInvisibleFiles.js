import util from "util";
import co from "co";
import logger from "../../lib/logger";

// models
import Tenant from "../../lib/models/Tenant";
import File from "../../lib/models/File";
import Tag from "../../lib/models/Tag";

const task = () => {
  co(function* () {
    try {
      logger.info("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始");
      // console.log("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始");

      if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
      const tenant_name = process.argv[3];

      const tenant = yield Tenant.findOne({ name: tenant_name });
      if (tenant === null) throw new Error(`指定されたテナントは存在しません ${tenant_name}`);

      const unvisibleTag = yield Tag.findOne({
        label: "非表示",
        tenant_id: tenant._id
      });

      const unvisibleFiles = yield File.find({
        tags: unvisibleTag._id,
        unvisible: false
      });

      // console.log(`非表示パッチ適用対象のレコード数: ${unvisibleFiles.length}`);
      // console.log(`非表示パッチ適用対象のレコード: ${unvisibleFiles}`);

      logger.info(`非表示パッチ適用対象のレコード数: ${unvisibleFiles.length}`);
      logger.info(`非表示パッチ適用対象のレコード: ${unvisibleFiles}`);

      const changedFiles = yield unvisibleFiles.map( file => {
        file.unvisible = true;
        return file.save();
      });

      logger.info(`非表示パッチを適用したレコード数: ${changedFiles.length}`);
      logger.info(`非表示パッチを適用したレコード: ${changedFiles}`);
      logger.info("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");

      // console.log(`非表示パッチを適用したレコード数: ${changedFiles.length}`);
      // console.log(`非表示パッチを適用したレコード: ${changedFiles}`);
      // console.log("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");
      process.exit();
    }
    catch (e) {
      logger.error(e);
      console.log(e);
      process.exit();
    }
  });
};

export default task;
