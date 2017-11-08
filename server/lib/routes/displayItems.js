import { Router } from "express";
import * as controller from "../controllers/displayItems";

const router = Router();

router.get("/", controller.index);

export default router;
