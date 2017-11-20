import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import * as _ from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const { ObjectId } = mongoose.Types;

const meta_infos_url = "/api/v1/meta_infos";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

describe(meta_infos_url, () => {

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
        const user_id = res.body.body.user._id;

        return new Promise( (resolve, reject) => {
          request
            .get(`/api/v1/users/${user_id}`)
            .end( (err, res) => resolve(res));
        });
      }).then( res => {
        user = res.body.body;
        done();
      });
    });
  });

  describe("get /", () => {
    let payload;

    before( done => {
      request
        .get(meta_infos_url)
        .end( (err, res) => {
          payload = res;
          done();
        });
    });

    it("http(200)が返却される", done => {
      expect(payload.status).equal(200);
      done();
    });

    it("successはtrue", done => {
      expect(payload.body.status.success).equal(true);
      done();
    });

    it("必要なカラムを含んでいる", done => {
      const needle = ["_id", "tenant_id", "name", "value_type"];

      const columns = payload.body.body
            .map( meta => _.keys(meta) )
            .map( keys => _.intersection(keys, needle) )
            .map( keys => keys.length === needle.length );
      
      expect(columns.every( b => b === true)).equal(true);
      done();
    });

    describe("metaInfoオジェクトの型", () => {
      let metaInfo;

      before( done => {
        metaInfo = _.head(payload.body.body);
        done();
      });

      it("_idはmongo oid型", done => {
        expect(mongoose.Types.ObjectId.isValid(metaInfo._id)).equal(true);
        done();
      });

      it("tenant_idはmongo oid型", done => {
        expect(mongoose.Types.ObjectId.isValid(metaInfo.tenant_id)).equal(true);
        done();
      });

      it("nameは0文字以上の文字列", done => {
        expect(metaInfo.name.length > 0).equal(true);
        done();
      });

      it("labelは0文字以上の文字列", done => {
        expect(metaInfo.label.length > 0).equal(true);
        done();
      });

      it("value_typeは0文字以上の文字列", done => {
        expect(metaInfo.value_type.length > 0).equal(true);
        done();
      });
    });
  });

  describe("get /value_type", () => {
    let payload;

    before( done => {
      request
        .get(meta_infos_url + "/value_type")
        .end( (err, res) => {
          payload = res;
          done();
        });
    });

    it("http(200)が返却される", done => {
      expect(payload.status).equal(200);
      done();
    });

    it("必要なカラムを含んでいる", done => {
      const needle = ["name"];
      const columns = payload.body.status.value_type
            .map( meta => _.keys(meta) )
            .map( keys => _.intersection(keys, needle) )
            .map( keys => keys.length === needle.length );
      
      expect(columns.every( b => b === true)).equal(true);
      done();
    });

    it("value_typeオジェクトにnameが含まれており0文字以上の文字列", done => {
      const value_type = _.head(payload.body.status.value_type);
      expect(value_type.name.length > 0).equal(true);
      done();
    });
  });

  describe("get /:meta_info_id", () => {
    let payload;

    before( done => {
      request
        .get(meta_infos_url)
        .end( (err, res) => {
          const meta_info = _.head(res.body.body);

          request
            .get(meta_infos_url + `/${meta_info._id}`)
            .end( (err, res) => {
              payload = res;
              done();
            });

        });
    });

    it("http(200)が返却される", done => {
      expect(payload.status).equal(200);
      done();
    });

    it("必要なカラムを含んでいる", done => {
      const needle = ["_id", "tenant_id", "name", "value_type"];
      const columns = _.chain(payload.body.body)
        .keys()
        .intersection(needle)
        .value();

      expect(columns.length === needle.length).equal(true);
      done();
    });

    describe("metaInfoオジェクトの型", () => {
      let metaInfo;

      before( done => {
        metaInfo = payload.body.body;
        done();
      });

      it("_idはmongo oid型", done => {
        expect(mongoose.Types.ObjectId.isValid(metaInfo._id)).equal(true);
        done();
      });

      it("tenant_idはmongo oid型", done => {
        expect(mongoose.Types.ObjectId.isValid(metaInfo.tenant_id)).equal(true);
        done();
      });

      it("nameは0文字以上の文字列", done => {
        expect(metaInfo.name.length > 0).equal(true);
        done();
      });

      it("labelは0文字以上の文字列", done => {
        expect(metaInfo.label.length > 0).equal(true);
        done();
      });

      it("value_typeは0文字以上の文字列", done => {
        expect(metaInfo.value_type.length > 0).equal(true);
        done();
      });
    });

    describe(":meta_info_idにoid以外の文字列を指定した場合", () => {
      let payload;
      let expected = {
        message: "メタ情報の取得に失敗しました",
        detail: "指定されたメタ情報が存在しないためメタ情報の取得に失敗しました"
      };

      before( done => {
        request
          .get(meta_infos_url + "/invalid_oid")
          .end( (err, res) => {
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

  describe("post /", () => {
    describe("必要な情報にてメタ情報を作成した場合", () => {
      let payload;
      let body;

      before( done => {
        body = {
          metainfo: {
            tenant_id: user.tenant_id,
            name: "test",
            label: "テスト",
            value_type: "String"
          }
        };

        request
          .post(meta_infos_url)
          .send(body)
          .end( (err, res) => {
            payload = res;
            done();
          });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      describe("作成したメタ情報の詳細を取得した場合", () => {
        let nextPayload;

        before( done => {
          request
            .get(meta_infos_url + `/${payload.body.body._id}`)
            .end( (err, res) => {
              nextPayload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(nextPayload.status).equal(200);
          done();
        });

        it("nameが作成した時点のものと一致する", done => {
          expect(nextPayload.body.body.name).equal(body.metainfo.name);
          done();
        });

        it("labelが作成した時点のものと一致する", done => {
          expect(nextPayload.body.body.label).equal(body.metainfo.label);
          done();
        });

        it("value_typeが作成した時点のものと一致する", done => {
          expect(nextPayload.body.body.value_type).equal(body.metainfo.value_type);
          done();
        });
      });
    });

    describe("nameが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              // name: "test",
              label: "テスト",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("nullの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: null,
              label: "テスト",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("空文字の場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "",
              label: "テスト",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("文字長が255を超過する場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名が制限文字数を超過したためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: _.range(257).map( i => "1" ).join(""),
              label: "テスト",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });
      });

      describe("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", () => {
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためメタ情報の登録に失敗しました"
        };

        describe("バックスラッシュ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "\\foo\\bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });

        describe("スラッシュ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "/foo/bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("コロン", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: ":foo:bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("アスタリスク", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "*foo*bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("クエスチョン", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "?foo?bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("山括弧開く", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "<foo<bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("山括弧閉じる", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: ">foo>bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });
        describe("パイプ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "|foo|bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });
      });
    });

    describe("labelが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報の表示名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              // label: "テスト",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("nullの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報の表示名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: null,
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("空文字の場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報の表示名が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: "",
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("文字長が255を超過する場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報の表示名が規定文字数を超過したためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: _.range(257).map(i => "1").join(""),
              value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });
      });

      describe("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", () => {
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報の表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためメタ情報の登録に失敗しました"
        };

        describe("バックスラッシュ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "\\foo\\bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("スラッシュ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "/foo/bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("コロン", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: ":foo:bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("アスタリスク", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "*foo*bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("クエスチョン", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "?foo?bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("山括弧開く", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "<foo<bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });

        describe("山括弧閉じる", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: ">foo>bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });

        describe("パイプ", () => {
          let body;
          let payload;

          before( done => {
            body = {
              metainfo: {
                name: "|foo|bar",
                label: "テスト",
                value_type: "String"
              }
            };

            request
              .post(meta_infos_url)
              .send(body)
              .end( (err, res) => {
                payload = res;
                done();
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status).equal(false);
            done();
          });

          it(`エラー概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラー詳細は「${expected.detail}」`, done => {
            expect(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });

        });
      });
    });

    describe("value_typeが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたデータ型が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: "テスト"
              // value_type: "String"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("nullの場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたデータ型が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: "テスト",
              value_type: null
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("空文字の場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたデータ型が空のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: "テスト",
              value_type: ""
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });

      describe("[String, Number, Date]以外の場合", () => {
        let payload;
        let body;
        let expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたデータ型が(String, Number, Date)以外のためメタ情報の登録に失敗しました"
        };

        before( done => {
          body = {
            metainfo: {
              name: "test",
              label: "テスト",
              value_type: "Integer"
            }
          };

          request
            .post(meta_infos_url)
            .send(body)
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(400)が返却される", done => {
          expect(payload.status).equal(400);
          done();
        });

        it("statusはfalse", done => {
          expect(payload.body.status).equal(false);
          done();
        });

        it(`エラー概要は「${expected.message}」`, done => {
          expect(payload.body.status.message).equal(expected.message);
          done();
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          expect(payload.body.status.errors.tenant_id).equal(expected.detail);
          done();
        });

      });
    });

  });

});
