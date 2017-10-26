import mongoose from "mongoose";
import co from "co";
import AuthorityMenu from "../models/AuthorityMenu"

const { ObjectId } = mongoose.Types;

export const index = (req, res, next) => {
  co(function* (){
    try {

      const user_id = res.user._id;
      const condition = {
        users: ObjectId(user_id)
      }

      const menus = yield AuthorityMenu.getMenus(condition);

      res.json({
        status: { success: true },
        body: menus
      });

    } catch (e) {
      let errors = {};

      errors = e;
      res.status(400).json({
        status: { success: false, errors }
      });
    }
  });
}

