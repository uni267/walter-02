import { Router } from "express";
import Tag from "../models/Tag";

const router = Router();

router.get("/", (req, res, next) => {
  const conditions = {
    $or: [
      { tenant_id: res.user.tenant_id },
      { user_id: res.user._id }
    ]
  };

  Tag.find(conditions)
    .then( tags => {
      res.json({
        status: { success: true },
        body: tags
      });
    })
    .catch( err => {
      res.json({
        status: { success: false, errors: err },
        body: []
      });
    });
});

export default router;
