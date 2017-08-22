import { Router } from "express";
import Dir from "../models/Dir";
import File from "../models/File";

const router = Router();

router.get("/", (req, res, next) => {
  const conditions = {
    descendant: req.query.dir_id
  };

  Dir.find(conditions).sort({depth: -1}).then( dirs => {
    const conditions = { _id: dirs.map( dir => dir.ancestor ) };
    const fields = { name: 1 };

    File.find(conditions).select(fields).then( files => {

      const sorted = dirs.map( dir => {
        return files.filter( file => file.id == dir.ancestor );
      }).reduce( (a, b) => a.concat(b));

      const withSep = [].concat.apply([], sorted.map( (dir, idx) => {
        return (idx === 0) ? dir : ["sep", dir];
      }));

      res.json({
        status: { success: true },
        body: withSep
      });

    }).catch( err => {

      res.json({
        status: { success: false, errors: err },
        body: []
      });

    });

  }).catch( err => {

    res.json({
      status: { success: false, errors: err },
      body: []
    });

  });

});


export default router;
