import co from "co";
import mongoose from "mongoose";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const data = {
        rate: [
          { name: "used", value: 10 },
          { name: "free", value: 90 }
        ],
        usage: [
          { name: "2017-01", usage: 10, threshold: 100 },
          { name: "2017-02", usage: 15, threshold: 100 },
          { name: "2017-03", usage: 20, threshold: 100 },
          { name: "2017-04", usage: 30, threshold: 100 },
          { name: "2017-05", usage: 40, threshold: 100 },
          { name: "2017-06", usage: 60, threshold: 100 },
          { name: "2017-07", usage: 65, threshold: 100 },
          { name: "2017-08", usage: 70, threshold: 100 },
          { name: "2017-09", usage: 75, threshold: 100 }
        ],
        file_count: [
          { name: "2017-01", file_count: 100 },
          { name: "2017-02", file_count: 150 },
          { name: "2017-03", file_count: 200 },
          { name: "2017-04", file_count: 300 },
          { name: "2017-05", file_count: 400 },
          { name: "2017-06", file_count: 600 },
          { name: "2017-07", file_count: 650 },
          { name: "2017-08", file_count: 700 },
          { name: "2017-09", file_count: 750 }
        ]
      };

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


