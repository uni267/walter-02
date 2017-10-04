import { Router } from "express";
import * as controllers from "../controllers/metaInfos";
const router = Router();

router.route("/")
  .get(controllers.index) // 一覧
  .post(controllers.add); // 作成

export default router;
