import co from "co";
import mongoose from "mongoose";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const data = [
        { name: "2017-01", usage: 10, file_count: 100, threshold: 100 },
        { name: "2017-02", usage: 15, file_count: 150, threshold: 100 },
        { name: "2017-03", usage: 20, file_count: 200, threshold: 100 },
        { name: "2017-04", usage: 30, file_count: 300, threshold: 100 },
        { name: "2017-05", usage: 40, file_count: 400, threshold: 100 },
        { name: "2017-06", usage: 60, file_count: 600, threshold: 100 },
        { name: "2017-07", usage: 65, file_count: 650, threshold: 100 },
        { name: "2017-08", usage: 70, file_count: 700, threshold: 100 },
        { name: "2017-09", usage: 75, file_count: 750, threshold: 100 }
      ];

      res.json({
        status: { success: true },
        body: data
      });
    }
    catch (e) {
      console.log(e);

      let errors = {};
      errors.unknown = e;

      res.status(400).json({
        status: { success: false, errors }
      });

    }
  });
};


