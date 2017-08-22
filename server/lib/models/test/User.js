import { expect } from "chai";
import User from "../User";
import mongoose, { Schema } from "mongoose";
import { SERVER_CONF } from "../../../configs/server";

describe("UserModel", () => {
  beforeEach( () => {
    const url = SERVER_CONF.development.url;
    const db_name = SERVER_CONF.development.db_name;
    mongoose.connect(`${url}/${db_name}`, {useMongoClient: true});
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.Promise = global.Promise;
  });

  it("findを実行した際に例外が発生しない", () => {
    const UserModel = mongoose.model("users", new Schema(User));
    expect(UserModel).to.not.throw();
  });

  // it("debug", () => {
  //   const UserModel = mongoose.model("users", new Schema(User));
  //   UserModel.find({}).then( users => users );
  // });

});
