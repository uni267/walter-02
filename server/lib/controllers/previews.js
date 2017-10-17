import mongoose from "mongoose";
import co from "co";
import { logger } from "../index"

// models
import Preview from "../models/Preview";

export const image = (req, res, next) => {
  co(function* () {
    try {
      const { preview_id } = req.params;

      const preview = yield Preview.findById(preview_id);

      res.setHeader("Content-Type","image/png");
      res.send(preview.image.buffer);

    } catch (e) {
      logger.error(e);
      res.status(404).send('Not Found');
    }
  });
}
