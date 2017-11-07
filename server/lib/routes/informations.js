import { Router } from "express";
import * as controller from "../controllers/informations";

const router = Router();

router.get("/", controller.index) // お知らせ一覧取得
.post("/", controller.add); // お知らせの追加

// ユーザーのお知らせ一覧取得
router.get("/:user_id", controller.view);

// 件数取得
router.get("/:user_id/count", controller.getCount);

// 既読/未読の変更
router.patch("/:user_id/toggle", controller.toggleRead);


export default router;