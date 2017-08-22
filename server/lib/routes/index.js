import { Router } from "express";
import BeforeRouter from "./before";
import LoginRouter from "./login";
import UserRouter from "./users";
import FileRouter from "./files";
import DirRouter from "./dirs";
import TagRouter from "./tags";
import TestRouter from "./test";

const router = Router();

router.use("/api/v1/*", BeforeRouter);
router.use("/api/login", LoginRouter);
router.use("/api/v1/users", UserRouter);
router.use("/api/v1/files", FileRouter);
router.use("/api/v1/dirs", DirRouter);
router.use("/api/v1/tags", TagRouter);
router.use("/test", TestRouter);

export default router;
