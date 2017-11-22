import util from "util";
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

const files_url = "/api/v1/files";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

describe(files_url, () => {

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

  describe("post /", () => {
    describe("基本的な情報のみをアップロード(正常系)", () => {
      let payload;
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
        request
          .post(files_url)
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

      describe("アップロードしたファイルを取得した場合", () => {
        let nextPayload;

        before( done => {
          const file_id = _.get(payload, ["body", "body", "0", "_id"]);

          request
            .get(files_url + `/${file_id}`)
            .end( (err, res) => {
              nextPayload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(nextPayload.status).equal(200);
          done();
        });

        it("nameが指定した値で保存されている", done => {
          expect(nextPayload.body.body.name).equal(_.head(body.files).name);
          done();
        });

        it("sizeが指定した値で保存されている", done => {
          expect(nextPayload.body.body.size).equal(_.head(body.files).size);
          done();
        });

        it("mime_typeが指定した値で保存されている", done => {
          expect(nextPayload.body.body.mime_type).equal(_.head(body.files).mime_type);
          done();
        });
      });
    });

    describe("基本的な情報のみアップード(異常系)", () => {
      describe("nameが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "ファイル名が空のためファイルのアップロードに失敗しました"
          };

          let body = {
            files: [
              {
                // name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e"
              }
            ]
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`メッセージの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`メッセージの詳細は「${expected.detail}」`, done => {
            expect(_.head(payload.body.status.errors.body).errors.name)
              .equal(expected.detail);
            done();
          });
        });

        describe("nullの場合", () => {
          let payload;
          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "ファイル名が空のためファイルのアップロードに失敗しました"
          };

          let body = {
            files: [
              {
                name: null,
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e"
              }
            ]
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`メッセージの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`メッセージの詳細は「${expected.detail}」`, done => {
            expect(_.head(payload.body.status.errors.body).errors.name)
              .equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "ファイル名が空のためファイルのアップロードに失敗しました"
          };

          let body = {
            files: [
              {
                name: "",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e"
              }
            ]
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`メッセージの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`メッセージの詳細は「${expected.detail}」`, done => {
            expect(_.head(payload.body.status.errors.body).errors.name)
              .equal(expected.detail);
            done();
          });
        });

        describe("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", () => {
          describe("バックスラッシュ", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "\\foo\\bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("スラッシュ", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "/foo/bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("コロン", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: ":foo:bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });

          });

          describe("アスタリスク", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "*foo*bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("クエスチョン", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "?foo?bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("山括弧開く", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "<foo<bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("山括弧閉じる", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: ">foo>bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });

          describe("パイプ", () => {
            let payload;
            let expected = {
              message: "ファイルのアップロードに失敗しました",
              detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
            };

            let body = {
              files: [
                {
                  name: "|foo|bar",
                  size: 4,
                  mime_type: "text/plain",
                  base64: "data:text/plain;base64,Zm9vCg==",
                  checksum: "8f3bee6fbae63be812de5af39714824e"
                }
              ]
            };

            before( done => {
              request
                .post(files_url)
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
              expect(payload.body.status.success).equal(false);
              done();
            });

            it(`メッセージの概要は「${expected.message}」`, done => {
              expect(payload.body.status.message).equal(expected.message);
              done();
            });

            it(`メッセージの詳細は「${expected.detail}」`, done => {
              expect(_.head(payload.body.status.errors.body).errors.name)
                .equal(expected.detail);
              done();
            });
          });
        });
      });

      describe("sizeが", () => {
        describe("数値以外の場合", () => {
          let payload;
          let body = {

          };

        });
      });

      describe("mime_typeが", () => {
        describe("undefinedの場合", () => {
          it("dummy");
        });

        describe("nullの場合", () => {
          it("dummy");
        });

        describe("空文字の場合", () => {
          it("dummy");
        });

      });

      describe("checksumが", () => {
        describe("一致しない場合", () => {
          it("dummy");
        });
      });

      describe("base64が", () => {
        describe("undefinedの場合", () => {
          it("dummy");
        });

        describe("nullの場合", () => {
            it("dummy");
        });

      });

    });

    describe("ファイル名が重複する場合", () => {
      it("dummy");
    });

    describe("メタ情報を指定した場合(正常系)", () => {
      let payload;
      let metainfo;
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
        request
          .get("/api/v1/meta_infos")
          .end( (err, res) => {
            metainfo = {
              _id: _.get(res, ["body", "body", "0", "_id"]),
              value: "metainfo value"
            };

            body.files[0].meta_infos = [metainfo];

            request
              .post(files_url)
              .send(body)
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

      describe("アップロードしたファイルを取得した場合", () => {
        let nextPayload;

        before( done => {
          const file_id = _.get(payload, ["body", "body", "0", "_id"]);

          request
            .get(files_url + `/${file_id}`)
            .end( (err, res) => {
              nextPayload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(nextPayload.status).equal(200);
          done();
        });

        it("meta_infosが指定した値で保存されている", done => {
          const payloadMetainfo = _.get(nextPayload, ["body", "body", "meta_infos", "0"]);
          const postMetainfo = _.get(body, ["files", "0", "meta_infos", "0"]);

          expect(payloadMetainfo._id).equal(postMetainfo._id);
          expect(payloadMetainfo.value).equal(postMetainfo.value);
          done();
        });

      });
    });

    describe("メタ情報を指定した場合(異常系)", () => {
      describe("metainfo_idが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e",
              meta_infos: [
                {
                  // _id: ""
                  value: "foobar"
                }
              ]
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_id"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("nullの場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e",
              meta_infos: [
                {
                  _id: null,
                  value: "foobar"
                }
              ]
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_id"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e",
              meta_infos: [
                {
                  _id: "",
                  value: "foobar"
                }
              ]
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_id"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("mongoのoid形式ではない場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e",
              meta_infos: [
                {
                  _id: "invalid_oid",
                  value: "foobar"
                }
              ]
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報が存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_id"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("指定されたmetainfo_idがマスタに存在しない場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e",
              meta_infos: [
                {
                  _id: ObjectId(),
                  value: "foobar"
                }
              ]
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報が存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_id"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });
      });

      describe("valueが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e"
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報の値が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .get("/api/v1/meta_infos")
              .end( (err, res) => {
                metainfo = {
                  _id: _.get(res, ["body", "body", "0", ""])
                };
                body.files[0].meta_infos = [metainfo];

                request
                  .post(files_url)
                  .send(body)
                  .end( (err, res) => {
                    payload = res;
                    done();
                  });
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_value"]);
            expect(_err).equal(expected.detail);
            done();
          });

        });

        describe("nullの場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e"
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報の値が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .get("/api/v1/meta_infos")
              .end( (err, res) => {
                metainfo = {
                  _id: _.get(res, ["body", "body", "0", ""]),
                  value: null
                };
                body.files[0].meta_infos = [metainfo];

                request
                  .post(files_url)
                  .send(body)
                  .end( (err, res) => {
                    payload = res;
                    done();
                  });
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_value"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let metainfo;
          let body = {
            files: [{
              name: "test.txt",
              size: 4,
              mime_type: "text/plain",
              base64: "data:text/plain;base64,Zm9vCg==",
              checksum: "8f3bee6fbae63be812de5af39714824e"
            }]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたメタ情報の値が空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .get("/api/v1/meta_infos")
              .end( (err, res) => {
                metainfo = {
                  _id: _.get(res, ["body", "body", "0", ""]),
                  value: ""
                };
                body.files[0].meta_infos = [metainfo];

                request
                  .post(files_url)
                  .send(body)
                  .end( (err, res) => {
                    payload = res;
                    done();
                  });
              });
          });

          it("http(400)が返却される", done => {
            expect(payload.status).equal(400);
            done();
          });

          it("statusはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "metainfo_value"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });
      });
    });

    describe("タグを指定した場合(正常系)", () => {
      let payload;
      let tag;
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
        request
          .get("/api/v1/tags")
          .end( (err, res) => {
            tag = _.get(res, ["body", "body", "0", "_id"]);

            body.files[0].tags = [tag];

            request
              .post(files_url)
              .send(body)
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

      describe("アップロードしたファイルを取得した場合", () => {
        let nextPayload;

        before( done => {
          const file_id = _.get(payload, ["body", "body", "0", "_id"]);

          request
            .get(files_url + `/${file_id}`)
            .end( (err, res) => {
              nextPayload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(nextPayload.status).equal(200);
          done();
        });

        it("tagsが指定した値で保存されている", done => {
          const payloadTag = _.get(nextPayload, ["body", "body", "tags", "0", "_id"]);
          const postTag = _.get(body, ["files", "0", "tags", "0"]);

          expect(payloadTag).equal(postTag);
          done();
        });

      });
    });

    describe("タグを指定した場合(異常系)", () => {
      describe("tag_idが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let body = {
            files: [
              {
                name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e",
                tags: [] // 空配列[0]はundefinedなので
              }
            ]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたタグが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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

          it("successはfalse", done => {
            expect(payload.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "tags"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("nullの場合", () => {
          let payload;
          let body = {
            files: [
              {
                name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e",
                tags: [ null ]
              }
            ]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたタグが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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

          it("successはfalse", done => {
            expect(payload.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "tags"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let body = {
            files: [
              {
                name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e",
                tags: [ "" ]
              }
            ]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたタグが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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

          it("successはfalse", done => {
            expect(payload.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "tags"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("mongoのoid形式ではない場合", () => {
          let payload;
          let body = {
            files: [
              {
                name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e",
                tags: [ "invalid_oid" ]
              }
            ]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたタグが存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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

          it("successはfalse", done => {
            expect(payload.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "tags"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("tagがマスタに存在しない場合", () => {
          let payload;
          let body = {
            files: [
              {
                name: "test.txt",
                size: 4,
                mime_type: "text/plain",
                base64: "data:text/plain;base64,Zm9vCg==",
                checksum: "8f3bee6fbae63be812de5af39714824e",
                tags: [ ObjectId() ]
              }
            ]
          };

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたタグが存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            request
              .post(files_url)
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

          it("successはfalse", done => {
            expect(payload.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "tags"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

      });
    });

    describe("ロールを指定した場合(正常系)", () => {
      let payload;
      let role_file_id;
      let user_id;

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
        new Promise( (resolve, reject) => {

          request
            .get("/api/v1/role_files")
            .end( (err, res) => resolve(res) );

        }).then( res => {
          role_file_id = _.get(res, ["body", "body", "0", "_id"]);

          return new Promise( (resolve, reject) => {
            request
              .get("/api/v1/users")
              .end( (err, res) => resolve(res) );
          });

        }).then( res => {
          user_id = _.get(res, ["body", "body", "0", "_id"]);

          body.files[0].authorities = [
            { role_files: role_file_id, users: user_id }
          ];

          return new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );
            
          });
        }).then( res => {
          payload = res;
          done();
        });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      describe("アップロードしたファイルを取得した場合", () => {
        let nextPayload;

        before( done => {
          
          const file_id = _.get(payload, ["body", "body", "0", "_id"]);

          request
            .get(files_url + `/${file_id}`)
            .end( (err, res) => {
              nextPayload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(nextPayload.status).equal(200);
          done();
        });

        it("ロールが指定した値で保存されている", done => {
          let authority = _.get(nextPayload, ["body", "body", "authorities", "1"]);

          const _role_file_id = authority.role_files._id;
          const _user_id = authority.users._id;

          expect(_role_file_id).equal(role_file_id);
          expect(_user_id).equal(user_id);
          done();
        });

      });
    });

    describe("ロールを指定した場合(異常系)", () => {
      describe("role_file_idが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/users")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              user_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: user_id }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });
        describe("nullの場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/users")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              user_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: null, users: user_id }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/users")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              user_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: "", users: user_id }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("mongoのoid形式ではない場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/users")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              user_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: "invalid_oid", users: user_id }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("role_idがマスタに存在しない場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが存在しないためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/users")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              user_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: ObjectId(), users: user_id }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });
      });

      describe("user_idが", () => {
        describe("undefinedの場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/role_files")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              role_file_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: undefined }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });

        });

        describe("nullの場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/role_files")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              role_file_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: undefined }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("空文字の場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/role_files")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              role_file_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: "" }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("mongoのoid形式ではない場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/role_files")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              role_file_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: "invalid_oid" }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });

        describe("user_idがマスタに存在しない場合", () => {
          let payload;
          let role_file_id;
          let user_id;

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

          let expected = {
            message: "ファイルのアップロードに失敗しました",
            detail: "指定されたロールが空のためファイルのアップロードに失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {

              request
                .get("/api/v1/role_files")
                .end( (err, res) => resolve(res) );

            }).then( res => {
              role_file_id = _.get(res, ["body", "body", "0", "_id"]);

              body.files[0].authorities = [
                { role_files: role_file_id, users: ObjectId() }
              ];

              return new Promise( (resolve, reject) => {
                request
                  .post(files_url)
                  .send(body)
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

          it("successはfalse", done => {
            expect(payload.body.status.success).equal(false);
            done();
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            expect(payload.body.status.message).equal(expected.message);
            done();
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            const _err = _.get(payload, ["body", "status", "errors", "body", "0", "errors", "authorities"]);
            expect(_err).equal(expected.detail);
            done();
          });
        });
      });
    });

  });
});



