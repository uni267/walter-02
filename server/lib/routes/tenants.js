import { Router } from "express";
import * as controller from "../controllers";

const router = Router();

// view
router.get("/:tenant_id", controller.view);

export default router;
