import { Router } from "express";
import * as controller from "../controllers/notifications";

const router = Router();

router.get("/", controller.view) // お知らせ一覧取得
.post("/", controller.add); // お知らせの追加

// すべてのお知らせ一覧取得
router.get("/all", controller.index);

// 件数取得
router.get("/:user_id/count", controller.getCount);

// 既読/未読の変更
router.patch("/:user_id/toggle", controller.toggleRead);

// 既読に更新
router.patch("/:user_id/read", controller.updateRead);
// 未読に更新
router.patch("/:user_id/unread", controller.updateUnread);

export default router;