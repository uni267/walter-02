import { Router } from "express";
import * as controller from "../controllers/informations";

const router = Router();

// お知らせ一覧取得
router.get("/", controller.index)
.post("/", controller.add);

router.get("/:user_id", controller.view);

export default router;