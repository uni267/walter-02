import co from "co";
import mongoose from "mongoose";

export const index = (req, res, next) => {
  co(function* () {
    try {
      const data = {
        totals: [
          { name: "usage", label: "使用容量", value: 30 },
          { name: "free", label: "空き容量", value: 170 }
        ],
        usages: [
          { name: "2017-01", usage: 10, free: 90 },
          { name: "2017-02", usage: 15, free: 85 },
          { name: "2017-03", usage: 20, free: 80 },
          { name: "2017-04", usage: 30, free: 70 },
          { name: "2017-05", usage: 40, free: 60 },
          { name: "2017-06", usage: 60, free: 40 },
          { name: "2017-07", usage: 65, free: 35 },
          { name: "2017-08", usage: 70, free: 30 },
          { name: "2017-09", usage: 75, free: 25 }
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
          { name: "taro", value: 100 },
          { name: "hanako", value: 30 }
        ],
        mimetypes: [
          { name: "excel", value: 100 },
          { name: "pdf", value: 30 },
          { name: "csv", value: 20 },
          { name: "txt", value: 10 }
        ],
        tags: [
          { name: "大事", value: 100 },
          { name: "仕事", value: 30 },
          { name: "それ以外", value: 20 }
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


