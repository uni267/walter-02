import { expect } from "chai";
import File from "../File";
import mongoose, { Schema } from "mongoose";
import { SERVER_CONF } from "../../../configs/server";

describe("FileModel", () => {
  beforeEach( () => {
    const url = SERVER_CONF.development.url;
    const db_name = SERVER_CONF.development.db_name;
    mongoose.connect(`${url}/${db_name}`, {useMongoClient: true});
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.Promise = global.Promise;
  });

  it("findを実行した際に例外が発生しない", () => {
    const FileModel = mongoose.model("files", new Schema(File));
    expect(FileModel).to.not.throw();
  });

});
