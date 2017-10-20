import co from "co";
import mongoose from "mongoose";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const data = {
        totals: [
          { name: "used", value: 3 },
          { name: "free", value: 100 }
        ],
        usages: [
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
        folders: [
          { name: "folderA", value: 100 },
          { name: "folderB", value: 80 },
          { name: "folderC", value: 70 },
          { name: "folderD", value: 60 },
          { name: "folderE", value: 50 },
          { name: "folderF", value: 40 },
          { name: "folderG", value: 30 },
          { name: "folderH", value: 20 },
          { name: "folderI", value: 10 },
          { name: "folderJ", value: 1 },
        ],
        users: [
          { name: "folderA", value: 100, color: '#0088FE' },
          { name: "folderB", value: 30, color: '#00C49F' },
          { name: "folderC", value: 20, color: '#FFBB28' },
          { name: "folderC", value: 10, color: '#00BB28' }
        ],
        mimetypes: [
          { name: "folderA", value: 100, color: '#0088FE' },
          { name: "folderB", value: 30, color: '#00C49F' },
          { name: "folderC", value: 20, color: '#FFBB28' },
          { name: "folderC", value: 10, color: '#00BB28' }
        ],
        tags: [
          { name: "folderA", value: 100, color: '#0088FE' },
          { name: "folderB", value: 30, color: '#00C49F' },
          { name: "folderC", value: 20, color: '#FFBB28' },
          { name: "folderC", value: 10, color: '#00BB28' }
        ],
        fileCount: [
          { name: "fileCount", value: 1000 }
        ],
        folderCount: [
          { name: "folderCount", value: 10 }
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


