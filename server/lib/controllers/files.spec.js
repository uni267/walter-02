import * as memMongo from "../test/memmongo";

import moment from "moment";
import * as _ from "lodash";
import { Swift } from "../storages/Swift";

import * as controller from "../controllers/files";

import * as filesData from "../test/filesdata";
import * as testHelper from "../test/helper";
import AppSetting from "../models/AppSetting";
import AuthorityFile from "../models/AuthorityFile";
import { DH_CHECK_P_NOT_SAFE_PRIME } from "constants";

jest.setTimeout(40000);
const tenant_name = 'files_' + 'test'


describe('lib/controllers/files', () => {
  let default_res
  let initData
  let appSetting
  const updateAppSetting = async value => {
    appSetting.enable = value
    await appSetting.save()
  }

  beforeAll(async () => {
    initData = await memMongo.connect(tenant_name)
    default_res = {
      user: { ...initData.user, tenant_id: initData.tenant._id, tenant: { ...initData.tenant } }
    }
    appSetting = await AppSetting.findOne({ tenant_id: initData.tenant._id, name: 'inherit_parent_dir_auth' })
  })
  afterAll(async () => {
    const org = initData.appSetting.filter(set => set.name === 'inherit_parent_dir_auth')
    if (org.length > 0) { //設定を元に戻す
      await updateAppSetting(org[0].enable)
    }
    await memMongo.disconnect()
  })

  const upload_file = async (files_array, dir_id) => {
    const req = {
      body: { files: files_array, dir_id }
    }
    const res_error_json = jest.fn()
    const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_error_json })) }
    await controller.upload(req, res)
    if (res.json.mock.calls.length === 0) {
      return { success: false, errors: res_error_json.mock.calls[0][0].status.errors}
    } else {
      return { success: true, res: res.json.mock.calls[0][0] }
    }
  }

  describe(`upload()`, () => {
    it(`テナント情報の取得`, async () => {
      expect(tenant_name).toBe(initData.tenant.name)
    })

    it(`files is empty`, async () => {
      const req = {
        body: { files: [] }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, status: jest.fn(() => ({ json: res_json })) }
      await controller.upload(req, res)

      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルのアップロードに失敗しました")
      expect(res_body.status.errors.files).toBeTruthy() //権限が正しい
    });
    it(`1ファイル成功 appSettings.inherit_parent_dir_auth === true`, async () => {
      await updateAppSetting(true)
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        expect(result.res.status.success).toBe(true)
        expect(result.res.body.length).toBe(1) //１ファイルの結果が返る
        const myAuthorityFiles = (await AuthorityFile.find({ files: result.res.body[0]._id }))
        const dirAuthorityFiles = (await AuthorityFile.find({ files: initData.tenant.home_dir_id }))
        expect(testHelper.verifyAuth(dirAuthorityFiles, myAuthorityFiles, initData.user, initData.roleFileFull._id)).toBeTruthy()
      } else {
        expect(result.errors).toBe('* 想定外なエラー')
      }
      
    });
    it(`3ファイル成功 appSettings.inherit_parent_dir_auth === true`, async () => {
      await updateAppSetting(true)
      const result = await upload_file([{ ...filesData.sample_file }, { ...filesData.sample_file }, { ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        expect(result.res.status.success).toBe(true)
        expect(result.res.body.length).toBe(3) //3ファイルの結果が返る
        const dirAuthorityFiles = (await AuthorityFile.find({ files: initData.tenant.home_dir_id }))
        for (let i = 1; i < result.res.body.length; i++){
          const myAuthorityFiles = (await AuthorityFile.find({ files: result.res.body[i]._id }))
          expect(testHelper.verifyAuth(dirAuthorityFiles, myAuthorityFiles, initData.user, initData.roleFileFull._id)).toBeTruthy() //権限が正しい
        }
      } else {
        expect(result.errors).toBe('* 想定外なエラー')
      }
    });
    it(`1ファイル成功 appSettings.inherit_parent_dir_auth === false`, async () => {
      await updateAppSetting(false)
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        expect(result.res.status.success).toBe(true)
        expect(result.res.body.length).toBe(1) //１ファイルの結果が返る
        const myAuthorityFiles = (await AuthorityFile.find({ files: result.res.body[0]._id }))
        expect(testHelper.verifyAuth([], myAuthorityFiles, initData.user, initData.roleFileFull._id)).toBeTruthy()
      } else {
        expect(result.errors).toBe('* 想定外なエラー')
      }
    });
    it(`3ファイル成功 appSettings.inherit_parent_dir_auth === false`, async () => {
      await updateAppSetting(false)
      const result = await upload_file([{ ...filesData.sample_file }, { ...filesData.sample_file }, { ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        expect(result.res.status.success).toBe(true)
        expect(result.res.body.length).toBe(3) //3ファイルの結果が返る
        for (let i = 1; i < result.res.body.length; i++) {
          const myAuthorityFiles = (await AuthorityFile.find({ files: result.res.body[i]._id }))
          expect(testHelper.verifyAuth([], myAuthorityFiles, initData.user, initData.roleFileFull._id)).toBeTruthy() //権限が正しい
        }
      } else {
        expect(result.errors).toBe('* 想定外なエラー')
      }
    });
  })

  describe(`view()`, () => {
    let file_id =null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`file_idが空です`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id: null}
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.view(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルの取得に失敗しました")
    })
    it(`成功`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.view(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        expect(res_body.body._id.toString()).toBe(file_id.toString()) //file_idが一致する
      }
    })
  })

  describe(`rename()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`file_id is empty`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id: null }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.rename(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイル名の変更に失敗しました")
    })
    it(`name is empty`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        body: {name: ''}
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.rename(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイル名の変更に失敗しました")
    })
    it(`成功`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const new_name = 'new_name'
      const req = {
        params: { file_id },
        body: { name: new_name }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      await controller.rename(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        expect(res_body.body.name).toBe(new_name) //nameが一致する
      }
    })
  })
  describe(`move()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
  })
  describe(`addTag()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)      
    })
  })
  describe(`removeTag()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`addMeta()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`removeMeta()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`toggleStar()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`addAuthority()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`removeAuthority()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`moveTrash()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
  describe(`deleteFileLogical()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting(true)
      // 事前にファイルをアップロード
      const result = await upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
    })
    it(`未作成のテスト`, async () => {
      expect(true).toBe(true)
    })
  })
});

