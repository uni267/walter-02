import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { intersection, uniq } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const dir_url = "/api/v1/dirs";
const login_url = "/api/login";

const request = defaults(supertest(app));
let auth;

describe(dir_url, () => {
  before ( done => {
    initdbPromise.then( () => {
      request.post(login_url)
        .send(authData)
        .end( (err, res) => {
          request.set("x-auth-cloud-storage", res.body.body.token);
          done();
        });
    });
  });

  describe("get /", () => {
    it("階層", done => {
      request.get(dir_url)
        .end( (err, res) => {
          console.log(res.body);
          done();
        });
    });
  });

  // describe("get /tree", () => {
  // });

  // describe("post /", () => {
  // });

  // describe("patch /:moving_id/move", () => {
  // });

});
