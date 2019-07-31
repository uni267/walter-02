import mongoose from "mongoose";
import initDb from "../batches/tasks/initDatabase";
import addTenant from "../batches/tasks/addTenant";

import { MongoMemoryServer } from 'mongodb-memory-server';

import moment from "moment";
import * as _ from "lodash";
//import defaults from "superagentdefaults";
//import * as test_helper from "../test/helper";
import { Swift } from "../storages/Swift";

import * as controller from "../controllers/dirs";
import User from "../models/User";
import Tenant from "../models/Tenant";


jest.setTimeout(40000);
const tenant_name = 'dirs_' + 'test'


describe('lib/controllers/dirs', () => {
  let default_res
  let mongoServer;
  const opts = { useNewUrlParser: true };
  let tenant
  let user
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, opts, (err) => {
      if (err) { console.error(err); }
    });
    await initDb()
    await addTenant(tenant_name)

    tenant = (await Tenant.findOne({ name: tenant_name })).toObject()
    user = (await User.findOne({ account_name: `${tenant_name}1` })).toObject()
    default_res = {
      user: { ...user, tenant_id: tenant._id, tenant: { ...tenant } }
    }
  })
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("lib/controllers/dirs test terminated")
  })


  describe(`create()`, () => {
    beforeAll(async () => {
    })
    it(`dir_id is empty`, async () => {
      const req = {
        body: { dir_id: null, dir_name: null }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.create(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("フォルダの作成に失敗しました")
    })
    it(`dir_name is empty`, async () => {
      const req = {
        body: { dir_id: tenant.home_dir_id, dir_name: null }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.create(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("フォルダの作成に失敗しました")
    })
    it(`成功`, async () => {
      const req = {
        body: { dir_id: tenant.home_dir_id, dir_name: 'new_name' }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.create(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        expect(res_body.body.name).toBe(req.body.dir_name) //nameが一致する
        expect(res_body.body.dir_id.toString()).toBe(req.body.dir_id.toString()) //dir_idが一致する
      }
    })
  })

});

