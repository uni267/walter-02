import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { has,first } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use('/', Router);

const base_url = "/api/v1/authority_files";
const login_url = "/api/login";

const request = defaults(supertest(app));
let tenant_id = "";
let file_id;
let login_user;
// テスト用のアップロードファイル(client側から送信しているPayload)
const requestPayload = {
  "dir_id":"",
  "files":[{
    "name":"text.txt",
    "size":134,
    "mime_type":"text/plain",
    "modified":1508212257000,
    "base64":"data:text/plain;base64,5pyd44Of44O844OG44Kj44Oz44Kw44Gr44Gk44GE44GmCiAgMS4gODo0NeOCiOOCiuODqeOCuOOCquS9k+aTjQogIDIuIOODqeOCuOOCquS9k+aTjee1guS6huW+jOOAgeWFqOS9k+OBuOOBrumAo+e1oQogIDMuIOalreWLmemWi+Wniwo=",
    "checksum":"028a17271a4abb1a6a82ed06f5f6cc60"
  }]};


describe(base_url,() => {
  before ( done => {
    initdbPromise.then( () => {
      request.post(login_url)
        .send(authData)
        .end( (err, res) => {
          tenant_id = res.body.body.user.tenant_id;
          login_user = res.body.body.user;
          requestPayload.dir_id = res.body.body.user.tenant.home_dir_id;
          request.set('x-auth-cloud-storage', res.body.body.token);

          // テスト用のファイルをアップロード
          request.post('/api/v1/files')
          .send(requestPayload).
          end((err,res) => {
            // ファイルアップロードの成功をチェック
            expect(res.status).equal(200);
            expect(res.body.status.success).equal(true);
            file_id = first(res.body.body)._id;
            done();
          });
        });
    });
  });

  describe('post /files',() => {

    let response;
    before(done => {
      // 権限一覧を取得
      request.get('/api/v1/role_files').end((err,res) =>{
        expect(res.status).equal(200);
        // ファイル権限を追加
        request.post(`/api/v1/files/${file_id}/authorities`)
        .send({
          user: login_user,
          role: res.body.body[0]
        }).end((err,res) => {
          expect(res.status).equal(200);
          done();
        });
      });
    });

    describe('異常系',() => {
      describe('file_idが未定義',() => {
        it.skip('comment', done => {done();});
      });
      describe('file_idが配列ではない',() => {
        it.skip('comment', done => {done();});
      });
      describe('存在しないfile_idを指定',() => {
        it.skip('http400', done => {done();});
      });
      describe('file_idにでたらめな数字を指定',() => {
        it.skip('comment', done => {done();});
      });
      describe('存在しないuserを指定',() => {
        it.skip('comment', done => {done();});
      });

    });
    describe('正常系',() => {

      describe('file_idを1件のみ指定',() => {
        before(done =>{
          let body = {
            files: [ file_id ]
          };
          // テスト用responseを取得
          request.post(`${base_url}/files`)
          .send(body)
          .end( ( err, res ) => {
            response = res;
            done();
          });

        });
        it('http(200)が返却される', done => {
          expect(response.status).equal(200);
          done();
        });

        it('statusはtrue',done => {
          expect(response.body.status.success).equal(true);
          done();
        });

        it('返却値はArrayである',done => {
          expect( typeof response.body.body ).equal('object');
          done();
        });

        it('_idが含まれる', done => {
          expect(has(response.body.body[0], '_id')).equal(true);
          done();
        });

        it('_idはObjectIdである',done => {
          expect(mongoose.Types.ObjectId.isValid(response.body.body[0]._id)).equal(true);
          done();
        });

        it('nameが含まれる', done => {
          expect(has(response.body.body[0], 'name')).equal(true);
          done();
        });

        it('nameはstringである',done => {
          expect( typeof response.body.body[0].name ).equal('string');
          done();
        });

        it('labelが含まれる', done => {
          expect(has(response.body.body[0], 'label')).equal(true);
          done();
        });

        it('labelはstringである',done => {
          expect( typeof response.body.body[0].label ).equal('string');
          done();
        });
      });

      describe('file_idを2件指定',() => {
        it.skip('http200', done => {done();});
      });

    });
  });

});