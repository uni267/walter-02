import mongoose from "mongoose";
import initDb from "../batches/tasks/initDatabase";
import addTenant from "../batches/tasks/addTenant";

import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = new MongoMemoryServer();

import moment from "moment";
import * as _ from "lodash";
//import defaults from "superagentdefaults";
//import * as test_helper from "../test/helper";
import { Swift } from "../storages/Swift";

import * as controller from "../controllers/files";
import User from "../models/User";
import Tenant from "../models/Tenant";


jest.setTimeout(30000);
const tenant_name = 'test'


describe('lib/controllers/files', () => {
  let mongoServer;
  const opts = { useNewUrlParser: true}; // remove this option if you use mongoose 5 and above  
  let tenant
  let user
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, opts, (err) => {
      if (err) console.error(err);
    });
    await initDb()
    await addTenant(tenant_name)

    tenant = await Tenant.findOne({ name: tenant_name })
    user = await User.findOne({ account_name: `${tenant_name}1` })
  })
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  })  

  beforeEach(() => {
    //console.log('outer before each')
  })

  afterEach(() => {
    //console.log('outer after each')
  })

  
  describe(`upload()`, () => {
    const default_req = {
      body: {
        files: []
      }
    }
    const default_res = {
      user: {...user}
    }
    default_res.user.tenant = { ...tenant }
    
    it(`パラメータ不正: files is empty`, async () => {
      const req = { ...default_req }
      req.body.files =[]  //ファイル情報を空にする
      const res_json = jest.fn()
      const res = { ...default_res, status: jest.fn(() => ({ json: res_json })) }
      await controller.upload(req, res)

      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      console.log(res_body)
      expect(res_body.status.success).toBe(false)  // status.success = false
    });
  })
});

