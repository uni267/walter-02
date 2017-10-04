import { Router } from "express";
import * as controllers from "../controllers/metaInfos";
const router = Router();

router.route("/")
  .get(controllers.index) // 一覧
  .post(controllers.add); // 作成

router.route("/:metainfo_id")
  .get(controllers.view)  // 詳細
  .delete(controllers.remove); // 削除

router.route("/:metainfo_id/key")
  .patch(controllers.updateKey);  // 表示名更新

router.route("/:metainfo_id/value_type")
  .patch(controllers.updateValueType);  // 表示名更新

export default router;
