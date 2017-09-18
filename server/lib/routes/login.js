import { Router } from "express";
import * as controller from "../controllers/login";

const router = Router();

router.route("/").post(controller.authentication);

export default router;
