import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { first, has, findIndex, indexOf, isMatch } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use('/', Router);

const base_url = "/api/v1/files";
const login_url = "/api/login";

const request = defaults(supertest(app));
let tenant_id = "";

describe(base_url,() => {
  before ( done => {
    initdbPromise.then( () => {
      request.post(login_url)
        .send(authData)
        .end( (err, res) => {
          tenant_id = res.body.body.user.tenant_id;
          request.set('x-auth-cloud-storage', res.body.body.token);
          done();
        });
    });
  });
});