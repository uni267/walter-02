import { Router } from "express";
import * as controller from "../controllers/tags";

const router = Router();

// 一覧
router.route("/")
  .get(controller.index)
  .post(controller.create);

// 詳細
router.route("/:tag_id")
  .get(controller.view)
  .delete(controller.remove);

// label変更
router.route("/:tag_id/label")
  .patch(controller.changeLabel);

// color変更
router.route("/:tag_id/color")
  .patch(controller.changeColor);

// 並び順一括変更
router.route("/order_number")
  .patch(controller.changeOrderNumber);

export default router;
