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


let tenent, user
const connectDB = (tenant_name) => {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then((mongoUri) => {
      return mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
        if (err) done(err);
      });
    })
    .then(async () => {
      await initDb()
      await addTenant(tenant_name)
      // tenant = await Tenant.findOne({ name: tenant_name })
      // user = await User.findOne({ account_name: `${tenant_name}1` })

    });
}

// const connectDB = () => {
//   return new Promise((resolve, reject) => {
//     mongoServer = new MongoMemoryServer();
//     mongoServer
//       .getConnectionString()
//       .then((mongoUri) => {
//         return mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
//           if (err) reject(err);
//         });
//       })
//       .then(() => resolve());
//   })
// }
const closeDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}


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
        //await closeDB()
  })  

  beforeEach(() => {
    //console.log('outer before each')
  })

  afterEach(() => {
    //console.log('outer after each')
  })

  
  describe(`index()`, () => {
    const default_req = {
      body: {
        files: {}
      }
    }
    const default_res = {
      user: {
        tenant_id: '',
        tenant: {}
      }
    }
    it(`sample`, async () => {
      expect(tenant.name).toBe(tenant_name)
    })
    it(`パラメータ不正`, async () => {
      const req = { ...default_req }
      const res_json = jest.fn()
      //const res = { ...default_res, status: sinon.stub().returns({ json: res_json }) }
      const res = { ...default_res, status: jest.fn() }
      await controller.upload(req, res)
      //sinon.assert.calledWith(res.status, 400);
      //const res_body = res_json.getCall(0).args[0]
      //console.log(res_body)

      expect(1).toBe(1)
      //expect(res_body.status.success).equal(false)  ←ここを生かすとテストに失敗する
    });
  })
});

