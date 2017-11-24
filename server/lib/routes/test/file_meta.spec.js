import util from "util";
import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import * as _ from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";
import * as helper from "./helper";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const { ObjectId } = mongoose.Types;

const files_url = "/api/v1/files";
const login_url = "/api/login";

const request = defaults(supertest(app));

describe(files_url, () => {
  let user;
  let body = {
    files: [
      {
        name: "test.txt",
        size: 4,
        mime_type: "text/plain",
        base64: "data:text/plain;base64,Zm9vCg==",
        checksum: "8f3bee6fbae63be812de5af39714824e"
      }
    ]
  };

  before( done => {
    initdbPromise.then( () => {
      new Promise( (resolve, reject) => {
        request.post(login_url)
          .send(authData)
          .end( (err, res) => {
            request.set("x-auth-cloud-storage", res.body.body.token);
            resolve(res);
          });
      }).then( res => {
        user = res.body.body.user;
        done();
      });
    });
  });

  describe("メタ情報の追加 post /:file_id/meta", () => {
    let meta;
    let file;

    before( done => {
      new Promise( (resolve, reject) => {
        request
          .get("/api/v1/meta_infos")
          .end( (err, res) => resolve(res) );

      }).then( res => {
        meta = _.get(res, ["body", "body", "0"]);        
        return new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );
        });
      }).then( res => {
        file = _.get(res, ["body", "body", "0"]);
        done();
      });
    });

    describe("正しいファイルid, メタ情報id, 値を指定した場合", () => {
      let payload;
      let nextPayload;
      let value = "test value";

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url + `/${file._id}/meta`)
            .send({ meta, value })
            .end( (err, res) => resolve(res) );
        }).then(res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });

        }).then(res => {
          nextPayload = res;
          done();
        });
      });
      
      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        expect(nextPayload.status).equal(200);
        done();
      });

      it("指定したmeta_id, valueが登録されている", done => {
        const _meta = _.get(nextPayload, ["body", "body", "meta_infos", "0"]);

        expect(_meta._id).equal(meta._id);
        expect(_meta.value).equal(value);
        done();
      });
    });

    describe("ファイルidがoid形式ではない場合", () => {
      let payload;
      let value = "test value";
      let expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の追加に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url + `/invalid_oid/meta`)
            .send({ meta, value })
            .end( (err, res) => resolve(res) );
        }).then(res => {
          payload = res;
          done();
        });
      });
      
      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("ファイルidが存在しない場合", () => {
      let payload;
      let value = "test value";
      let expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の追加に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url + `/${ObjectId()}/meta`)
            .send({ meta, value })
            .end( (err, res) => resolve(res) );
        }).then(res => {
          payload = res;
          done();
        });
      });
      
      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("メタidが既に登録されている場合", () => {
      let value = "test";
      let overValue = value + value;
      let payload;
      let nextPayload;

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url + `/${file._id}/meta`)
            .send({ meta, value })
            .end( (err, res) => resolve(res) );
        }).then( res => {
          return new Promise( (resolve, reject) => {
            request
              .post(files_url + `/${file._id}/meta`)
              .send({ meta, value: overValue })
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      it("2重登録されない", done => {
        const _meta = nextPayload.body.body.meta_infos.filter( _meta => _meta._id === meta._id );
        expect(_meta.length === 1).equal(true);
        done();
      });

      it("指定された値で上書きされる", done => {
        const _meta = nextPayload.body.body.meta_infos.filter( _meta => _meta._id === meta._id );
        expect(_.head(_meta).value).equal(overValue);
        done();
      });
    });

  });

  describe("メタ情報の削除 delete /:file_id/meta/:meta_id", () => {
    let file;
    let meta;
    let value = "test value";

    before( done => {
      new Promise( (resolve, reject) => {
        request
          .get("/api/v1/meta_infos")
          .end( (err, res) => resolve(res) );
      }).then( res => {
        meta = _.get(res, ["body", "body", "0"]);
        body.files[0].meta_infos = [
          { _id: meta._id, value }
        ];

        return new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );
        });

      }).then( res => {
        const file_id = _.get(res, ["body", "body", "0", "_id"]);

        return new Promise( (resolve, reject) => {
          request
            .get(files_url + `/${file_id}`)
            .end( (err, res) => resolve(res) );
        });

      }).then( res => {
        file = res.body.body;
        done();
      });
    });

    describe("正しいファイルid, メタidを指定した場合", () => {
      let payload;
      let nextPayload;

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/${file._id}/meta/${meta._id}`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      it("指定したメタ情報が削除されている", done => {
        const _meta = nextPayload.body.body.meta_infos.filter( meta => (
          meta._id === meta._id
        ));

        expect(_meta.length === 0).equal(true);
        done();
      });
    });

    describe("ファイルidがoid形式ではない場合", () => {
      let payload;
      let nextPayload;
      let expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の削除に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/invalid_oid/meta/${meta._id}`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("ファイルidが存在しない場合", () => {
      let payload;
      let nextPayload;
      let expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の削除に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/${ObjectId()}/meta/${meta._id}`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("メタidがoid形式ではない場合", () => {
      let payload;
      let nextPayload;
      let expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたメタ情報が存在しないためメタ情報の削除に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/${file._id}/meta/invalid_oid`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("メタidがマスタに存在しない場合", () => {
      let payload;
      let nextPayload;
      let expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたメタ情報が存在しないためメタ情報の削除に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/${file._id}/meta/${ObjectId()}`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(files_url + `/${file._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("メタidがファイルに存在しない場合", () => {
      let payload;
      let expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたメタ情報idがファイルに存在しないためメタ情報の削除に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .delete(files_url + `/${file._id}/meta/${meta._id}`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          return new Promise( (resolve, reject) => {
            request
              .delete(files_url + `/${file._id}/meta/${meta._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          payload = res;
          done();
        });
      });

      it("http(400)が返却される", done => {
        expect(payload.status).equal(400);
        done();
      });

      it(`エラーの概要は「${expected.message}」`, done => {
        expect(payload.body.status.message).equal(expected.message);
        done();
      });

      it(`エラーの詳細は「${expected.detail}」`, done => {
        expect(payload.body.status.errors.metainfo_id).equal(expected.detail);
        done();
      });

    });

  });

});
