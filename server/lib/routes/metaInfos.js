import { Router } from "express";
import * as controllers from "../controllers/metaInfos";
const router = Router();

router.get("/", controllers.index);

export default router;
