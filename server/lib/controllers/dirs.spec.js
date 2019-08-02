import * as memMongo from "../test/memmongo";

import moment from "moment";
import * as _ from "lodash";
import { Swift } from "../storages/Swift";

import * as controller from "../controllers/dirs";


jest.setTimeout(40000);
const tenant_name = 'dirs_' + 'test'


describe('lib/controllers/dirs', () => {
  let default_res
  let initData
  beforeAll(async () => {
    initData = await memMongo.connect(tenant_name)
    default_res = {
      user: { ...initData.user, tenant_id: initData.tenant._id, tenant: { ...initData.tenant } }
    }
  })
  afterAll(async () => {
    await memMongo.disconnect()
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
        body: { dir_id: initData.tenant.home_dir_id, dir_name: null }
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
        body: { dir_id: initData.tenant.home_dir_id, dir_name: 'new_name' }
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

