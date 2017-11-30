import { Router } from "express";
import * as controller from "../controllers/excels";

const router = Router();


// excel形式でダウンロード
router.get("/", controller.index);

export default router;