import * as memMongo from "../test/memmongo";

import moment from "moment";
import * as _ from "lodash";
import { Swift } from "../storages/Swift";

import * as controller from "../controllers/files";
import * as dir_controller from "../controllers/dirs";

import * as filesData from "../test/filesdata";
import * as testHelper from "../test/helper";
import AppSetting from "../models/AppSetting";
import AuthorityFile from "../models/AuthorityFile";
import { DH_CHECK_P_NOT_SAFE_PRIME } from "constants";

jest.setTimeout(40000);
const tenant_name = 'test'


describe('lib/controllers/files', () => {
  let default_res
  let initData
  let appSetting_InheritParentDirAuth
  const updateAppSetting_InheritParentDirAuth = async value => {
    appSetting_InheritParentDirAuth.enable = value
    await appSetting_InheritParentDirAuth.save()
  }

  beforeAll(async () => {
    initData = await memMongo.connect(tenant_name)
    default_res = {
      user: { ...initData.user, tenant_id: initData.tenant._id, tenant: { ...initData.tenant } }
    }
    appSetting_InheritParentDirAuth = await AppSetting.findOne({ tenant_id: initData.tenant._id, name: 'inherit_parent_dir_auth' })
  })
  afterAll(async () => {
    const org = initData.appSetting.filter(set => set.name === 'inherit_parent_dir_auth')
    if (org.length > 0) { //設定を元に戻す
      await updateAppSetting_InheritParentDirAuth(org[0].enable)
    }
    await memMongo.disconnect()
  })

  const _upload_file = async (files_array, dir_id) => {
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

  const _add_authority = async (file_id, user, group, role) => {
    const req = {
      params: { file_id },
      body: {
        user: user,
        group: group,
        role: role,
      }
    }
    const res_error_json = jest.fn()
    const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_error_json })) }
    await controller.addAuthority(req, res)
    if (res.json.mock.calls.length === 0) {
      return { success: false, errors: res_error_json.mock.calls[0][0].status.errors}
    } else {
      return { success: true, res: res.json.mock.calls[0][0] }
    }
  }
  const _create_dir = async (user, dir_id, dir_name) => {
    const req = {
      body: { dir_id, dir_name }
    }
    const res_error_json = jest.fn()
    const res = { user: { ...user }, json: jest.fn(), status: jest.fn(() => ({ json: res_error_json })) }
    await dir_controller.create(req, res)
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
      await updateAppSetting_InheritParentDirAuth(true)
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        expect(result.res.status.success).toBe(true)
        expect(result.res.body.length).toBe(1) //１ファイルの結果が返る
        const myAuthorityFiles = (await AuthorityFile.find({ files: result.res.body[0]._id }))
        const dirAuthorityFiles = (await AuthorityFile.find({ files: initData.tenant.home_dir_id }))
        //console.log(testHelper.authDiff(myAuthorityFiles, dirAuthorityFiles))
        expect(testHelper.verifyAuth(dirAuthorityFiles, myAuthorityFiles, initData.user, initData.roleFileFull._id)).toBeTruthy()
      } else {
        expect(result.errors).toBe('* 想定外なエラー')
      }
      
    });
    it(`3ファイル成功 appSettings.inherit_parent_dir_auth === true`, async () => {
      await updateAppSetting_InheritParentDirAuth(true)
      const result = await _upload_file([{ ...filesData.sample_file }, { ...filesData.sample_file }, { ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await updateAppSetting_InheritParentDirAuth(false)
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await updateAppSetting_InheritParentDirAuth(false)
      const result = await _upload_file([{ ...filesData.sample_file }, { ...filesData.sample_file }, { ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await updateAppSetting_InheritParentDirAuth(true)
      // 事前にファイルをアップロード
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await updateAppSetting_InheritParentDirAuth(true)
      // 事前にファイルをアップロード
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await updateAppSetting_InheritParentDirAuth(true)
      // 事前にファイルをアップロード
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
      } else {
        console.log(result.errors)
      }
      // 事前にフォルダ作成
      // フォルダの権限を削除
    })
  })
  describe(`addTag()`, () => {
  })
  describe(`removeTag()`, () => {
  })
  describe(`addMeta()`, () => {
  })
  describe(`removeMeta()`, () => {
  })
  describe(`toggleStar()`, () => {
  })

  describe(`addAuthority()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting_InheritParentDirAuth(true)
      // 事前にファイルをアップロード
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
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
      await controller.addAuthority(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルへの権限の追加に失敗しました")
    })
    it(`成功 ユーザーの読み取り権限追加`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        body: {
          user: { ...initData.user },
          group: null,
          role: { ...initData.roleFileReadonly },
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.addAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd )
        expect(diff.length).toBe(1) //変更前後で不一致は一件
        expect(diff[0].users.toString()).toBe(req.body.user._id.toString()) //差分権限のuser_idが一致
        expect(diff[0].group).toBeFalsy() //差分権限のgroup_idが一致
        expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
      }
    })
    it(`同一権限追加はエラー ユーザーの読み取り権限追加`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        body: {
          user: { ...initData.user },
          group: null,
          role: { ...initData.roleFileReadonly },
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.addAuthority(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルへの権限の追加に失敗しました")
      const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
      const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
      expect(diff.length).toBe(0) //変更前後で不一致なし
    })
    it(`成功 グループの読み取り権限追加`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        body: {
          user: null,
          group: { ...initData.groupMgr },
          role: { ...initData.roleFileReadonly },
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.addAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        expect(diff.length).toBe(1) //変更前後で不一致は一件
        expect(diff[0].groups.toString()).toBe(req.body.group._id.toString()) //差分権限のuser_idが一致
        expect(diff[0].user).toBeFalsy() //差分権限のgroup_idが一致
        expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
      }
    })
    it(`同一権限追加はエラー グループの読み取り権限追加`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        body: {
          user: null,
          group: { ...initData.groupMgr },
          role: { ...initData.roleFileReadonly },
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.addAuthority(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルへの権限の追加に失敗しました")
      const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
      const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
      expect(diff.length).toBe(0) //変更前後で不一致なし
    })
    it(`成功 親フォルダへの読み取り権限追加(user)`, async () => {
      let parent_dir_id 
      let child_dir_id
      let child_file_id
      let grandchild_file_id
      await (async() => {
        let result
        // TOP直下へ親フォルダ作成
        result = await _create_dir({ ...initData.user }, initData.tenant.home_dir_id, 'parent'+ testHelper.getUUID())
        parent_dir_id = result.res.body._id
        // 親フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], parent_dir_id)
        child_file_id = result.res.body[0]._id
        // 親フォルダへ子フォルダ作成
        result = await _create_dir({ ...initData.user }, parent_dir_id, 'child')
        child_dir_id = result.res.body._id
         // 子フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], child_dir_id)
        grandchild_file_id = result.res.body[0]._id
      })()
      const req = {
        params: { file_id: parent_dir_id },
        body: {
          user: { ...initData.user },
          group: null,
          role: { ...initData.roleFileReadonly },
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const file_id_array = [parent_dir_id,child_dir_id,child_file_id,grandchild_file_id]      
      const myAuthorityFiles_org_list = await Promise.all(file_id_array.map(async id => await AuthorityFile.find({ files: id })))
      await controller.addAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const diff_list = await Promise.all(file_id_array.map(async id => {
          const myAuthorityFiles_upd = await AuthorityFile.find({ files: id })
          const myAuthorityFiles_org = myAuthorityFiles_org_list[_.findIndex(myAuthorityFiles_org_list, authes => authes[0].files.toString() === id.toString())]

          return testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        }))
        diff_list.forEach(diff => {
          expect(diff.length).toBe(1) //変更前後で不一致は一件
          expect(diff[0].users.toString()).toBe(req.body.user._id.toString()) //差分権限のuser_idが一致
          expect(diff[0].group).toBeFalsy() //差分権限のgroup_idが一致
          expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
        })
      }
    })
    it(`成功 親フォルダへの読み取り権限追加(group)`, async () => {
      let parent_dir_id 
      let child_dir_id
      let child_file_id
      let grandchild_file_id
      await (async() => {
        let result
        // TOP直下へ親フォルダ作成
        result = await _create_dir({ ...initData.user }, initData.tenant.home_dir_id, 'parent'+ testHelper.getUUID())
        parent_dir_id = result.res.body._id
        // 親フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], parent_dir_id)
        child_file_id = result.res.body[0]._id
        // 親フォルダへ子フォルダ作成
        result = await _create_dir({ ...initData.user }, parent_dir_id, 'child')
        child_dir_id = result.res.body._id
         // 子フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], child_dir_id)
        grandchild_file_id = result.res.body[0]._id
      })()
      const req = {
        params: { file_id: parent_dir_id },
        body: {
          user: null,
          group: { ...initData.groupMgr },
          role: { ...initData.roleFileReadonly },
         }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const file_id_array = [parent_dir_id,child_dir_id,child_file_id,grandchild_file_id]      
      const myAuthorityFiles_org_list = await Promise.all(file_id_array.map(async id => await AuthorityFile.find({ files: id })))
      await controller.addAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const diff_list = await Promise.all(file_id_array.map(async id => {
          const myAuthorityFiles_upd = await AuthorityFile.find({ files: id })
          const myAuthorityFiles_org = myAuthorityFiles_org_list[_.findIndex(myAuthorityFiles_org_list, authes => authes[0].files.toString() === id.toString())]

          return testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        }))
        diff_list.forEach(diff => {
          expect(diff.length).toBe(1) //変更前後で不一致は一件
          expect(diff[0].groups.toString()).toBe(req.body.group._id.toString()) //差分権限のuser_idが一致
          expect(diff[0].user).toBeFalsy() //差分権限のgroup_idが一致
          expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
        })
      }
    })
  })
  describe(`removeAuthority()`, () => {
    let file_id = null
    beforeAll(async () => {
      await updateAppSetting_InheritParentDirAuth(true)
      // 事前にファイルをアップロード
      const result = await _upload_file([{ ...filesData.sample_file }], initData.tenant.home_dir_id)
      if (result.success) {
        file_id = result.res.body[0]._id
        const result2 = await _add_authority(file_id, { ...initData.user }, null, { ...initData.roleFileReadonly })
        if (result2.success) {
          const result3 = await _add_authority(file_id, null, {...initData.groupMgr}, { ...initData.roleFileReadonly })
          if (result3.success) {
          } else {
            console.log(result3.errors)
          }
        } else {
          console.log(result2.errors)
        }
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
      await controller.removeAuthority(req, res)
      expect(res.status.mock.calls[0][0]).toBe(400) // http response statusは400
      const res_body = res_json.mock.calls[0][0] //1回目の第一引数
      expect(res_body.status.success).toBe(false)
      expect(res_body.status.message).toBe("ファイルへの権限の削除に失敗しました")
    })
    it(`成功 ユーザーの読み取り権限削除(user)`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        query: {
          user_id: initData.user._id,
          group_id: null,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        expect(diff.length).toBe(1) //変更前後で不一致は一件
        expect(diff[0].users.toString()).toBe(initData.user._id.toString()) //差分権限のuser_idが一致
        expect(diff[0].group).toBeFalsy() //差分権限のgroup_idが一致
        expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
      }
    })
    it(`role is empty (user)`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        query: {
          user_id: initData.user._id,
          group_id: null,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        expect(diff.length).toBe(0) //変更前後で不一致なし
      }
    })
    it(`成功 ユーザーの読み取り権限削除(group)`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        query: {
          user_id: null,
          group_id: initData.groupMgr._id,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        expect(diff.length).toBe(1) //変更前後で不一致は一件
        expect(diff[0].groups.toString()).toBe(initData.groupMgr._id.toString()) //差分権限のgroup_idが一致
        expect(diff[0].user).toBeFalsy() //差分権限のuser_idが一致
        expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
      }
    })
    it(`role is empty (group)`, async () => {
      if (!file_id) { expect('').toBe('前処理に失敗'); return }
      const req = {
        params: { file_id },
        query: {
          user_id: null,
          group_id: initData.groupMgr._id,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const myAuthorityFiles_org = (await AuthorityFile.find({ files: file_id }))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const myAuthorityFiles_upd = (await AuthorityFile.find({ files: file_id }))
        const diff = testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        expect(diff.length).toBe(0) //変更前後で不一致なし
      }
    })
    it(`成功 親フォルダの読み取り権限削除(user)`, async () => {
      let parent_dir_id 
      let child_dir_id
      let child_file_id
      let grandchild_file_id
      await (async() => {
        let result
        // TOP直下へ親フォルダ作成
        result = await _create_dir({ ...initData.user }, initData.tenant.home_dir_id, 'parent'+ testHelper.getUUID())
        parent_dir_id = result.res.body._id
        // 親フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], parent_dir_id)
        child_file_id = result.res.body[0]._id
        // 親フォルダへ子フォルダ作成
        result = await _create_dir({ ...initData.user }, parent_dir_id, 'child')
        child_dir_id = result.res.body._id
         // 子フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], child_dir_id)
        grandchild_file_id = result.res.body[0]._id
        result = await _add_authority(parent_dir_id, { ...initData.user }, null, { ...initData.roleFileReadonly })
      })()
      const req = {
        params: { file_id: parent_dir_id },
        query: {
          user_id: initData.user._id,
          group_id: null,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const file_id_array = [parent_dir_id,child_dir_id,child_file_id,grandchild_file_id]      
      const myAuthorityFiles_org_list = await Promise.all(file_id_array.map(async id => await AuthorityFile.find({ files: id })))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const diff_list = await Promise.all(file_id_array.map(async id => {
          const myAuthorityFiles_upd = await AuthorityFile.find({ files: id })
          const myAuthorityFiles_org = myAuthorityFiles_org_list[_.findIndex(myAuthorityFiles_org_list, authes => authes[0].files.toString() === id.toString())]

          return testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        }))
        diff_list.forEach(diff => {
          expect(diff.length).toBe(1) //変更前後で不一致は一件
          expect(diff[0].users.toString()).toBe(initData.user._id.toString()) //差分権限のuser_idが一致
          expect(diff[0].group).toBeFalsy() //差分権限のgroup_idが一致
          expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
        })
      }
    })
    it(`成功 親フォルダの読み取り権限削除(group)`, async () => {
      let parent_dir_id 
      let child_dir_id
      let child_file_id
      let grandchild_file_id
      await (async() => {
        let result
        // TOP直下へ親フォルダ作成
        result = await _create_dir({ ...initData.user }, initData.tenant.home_dir_id, 'parent'+ testHelper.getUUID())
        parent_dir_id = result.res.body._id
        // 親フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], parent_dir_id)
        child_file_id = result.res.body[0]._id
        // 親フォルダへ子フォルダ作成
        result = await _create_dir({ ...initData.user }, parent_dir_id, 'child')
        child_dir_id = result.res.body._id
         // 子フォルダへファイルアップロード
        result = await _upload_file([{ ...filesData.sample_file }], child_dir_id)
        grandchild_file_id = result.res.body[0]._id
        result = await _add_authority(parent_dir_id, null, { ...initData.groupMgr }, { ...initData.roleFileReadonly })
      })()
      const req = {
        params: { file_id: parent_dir_id },
        query: {
          user_id: null,
          group_id: initData.groupMgr._id,
          role_id: initData.roleFileReadonly._id,
        }
      }
      const res_json = jest.fn()
      const res = { user: { ...default_res.user }, json: jest.fn(), status: jest.fn(() => ({ json: res_json })) }
      const file_id_array = [parent_dir_id,child_dir_id,child_file_id,grandchild_file_id]      
      const myAuthorityFiles_org_list = await Promise.all(file_id_array.map(async id => await AuthorityFile.find({ files: id })))
      await controller.removeAuthority(req, res)
      if (res.json.mock.calls.length === 0) {
        expect(res_json.mock.calls[0][0].status.errors).toBe('failed')
      } else {
        const res_body = res.json.mock.calls[0][0] //1回目の第一引数
        expect(res_body.status.success).toBe(true)
        const diff_list = await Promise.all(file_id_array.map(async id => {
          const myAuthorityFiles_upd = await AuthorityFile.find({ files: id })
          const myAuthorityFiles_org = myAuthorityFiles_org_list[_.findIndex(myAuthorityFiles_org_list, authes => authes[0].files.toString() === id.toString())]

          return testHelper.authDiff(myAuthorityFiles_org, myAuthorityFiles_upd)
        }))
        diff_list.forEach(diff => {
          expect(diff.length).toBe(1) //変更前後で不一致は一件
          expect(diff[0].groups.toString()).toBe(initData.groupMgr._id.toString()) //差分権限のgroup_idが一致
          expect(diff[0].user).toBeFalsy() //差分権限のuser_idが一致
          expect(diff[0].role_files.toString()).toBe(initData.roleFileReadonly._id.toString()) //差分権限のrolefile_idが一致
        })
      }
    })
  })
  describe(`moveTrash()`, () => {
  })
  describe(`deleteFileLogical()`, () => {
  })
});

