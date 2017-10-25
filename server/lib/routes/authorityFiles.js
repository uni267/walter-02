import { Router } from "express";
import * as controller from "../controllers/authorityFiles";

const router = Router();

// ユーザの権限を取得
router.get("/", controller.index);

// 選択したファイルの権限を取得
router.post("/files", controller.files);


export default router;
