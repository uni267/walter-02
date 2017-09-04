import { Router } from "express";
import mongoose from "mongoose";
import Group from "../models/Group";
import User from "../models/User";

const router = Router();

router.get("/", (req, res, next) => {

  Group.find({ tenant_id: mongoose.Types.ObjectId(req.query.tenant_id) })
    .then( groups => {
      res.groups = groups;
      const group_ids = groups.map( group => group._id );
      return User.find({ groups: { $in: group_ids } }, { groups: 1});
    })
    .then( users => {
      return res.groups.map( group => {
        const belongs_to_count = users.filter( user => {
          return user.groups
            .map(group => group.toString())
            .includes(group.id.toString());
        }).length;

        return {
          ...group.toObject(),
          belongs_to_count
        };
      });
    })
    .then( groups => {
      res.json({
        status: { success: true },
        body: groups
      });
    })
    .catch( err => {
      res.status(500).json({
        status: { success: false, errors: err }
      });
    });
});

export default router;
