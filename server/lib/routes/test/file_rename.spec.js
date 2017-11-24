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
let user;

describe("patch " + files_url + "/:file_id/rename", () => {
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
        const user_id = res.body.body.user._id;
        done();
      });
    });
  });

  describe("正しいファイルid、ファイル名を指定した場合", () => {
    let payload;
    let file;
    let changedName;

    before( done => {
      new Promise( (resolve, reject) => {
        request
          .post(files_url)
          .send(body)
          .end( (err, res) => resolve(res) );

      }).then( res => {
        file = _.get(res, ["body", "body", "0"]);
        changedName = "rename_" + file.name;

        return new Promise( (resolve, reject) => {
          request
            .patch(files_url + `/${file._id}/rename`)
            .send({ name: changedName })
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

    it("返却される値は変更されたファイル名", done => {
      expect(_.get(payload, ["body", "body", "name"])).equal(changedName);
      done();
    });
  });

  describe("ファイルidが", () => {
    describe("oid形式ではない場合", () => {
      let payload;
      let file;
      let expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "指定されたファイルIDが不正なためファイル名の変更に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );

        }).then( res => {
          file = _.get(res, ["body", "body", "0"]);

          return new Promise( (resolve, reject) => {
            request
              .patch(files_url + `/invalid_oid/rename`)
              .send({ name: "foobar" })
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
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("存在しないidの場合", () => {
      let payload;
      let file;
      let expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "指定されたファイルが存在しないためファイル名の変更に失敗しました"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );

        }).then( res => {
          file = _.get(res, ["body", "body", "0"]);

          return new Promise( (resolve, reject) => {
            request
              .patch(files_url + `/${ObjectId()}/rename`)
              .send({ name: "foobar" })
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
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
  });

  describe("ファイル名が", () => {
    describe("undefinedの場合", () => {
      let payload;
      let file;
      let expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空です"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );

        }).then( res => {
          file = _.get(res, ["body", "body", "0"]);

          return new Promise( (resolve, reject) => {
            request
              .patch(files_url + `/${file._id}/rename`)
              .send()
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
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("nullの場合", () => {
      let payload;
      let file;
      let expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空です"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );

        }).then( res => {
          file = _.get(res, ["body", "body", "0"]);

          return new Promise( (resolve, reject) => {
            request
              .patch(files_url + `/${file._id}/rename`)
              .send({ name: null })
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
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("空文字の場合", () => {
      let payload;
      let file;
      let expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空です"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .post(files_url)
            .send(body)
            .end( (err, res) => resolve(res) );

        }).then( res => {
          file = _.get(res, ["body", "body", "0"]);

          return new Promise( (resolve, reject) => {
            request
              .patch(files_url + `/${file._id}/rename`)
              .send({ name: "" })
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
        expect(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });

    describe("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", () => {
      describe("バックスラッシュ", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "\\foo\\bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("スラッシュ", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "/foo/bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("コロン", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: ":foo:bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("アスタリスク", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "*foo*bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("クエスチョン", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "?foo?bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("山括弧開く", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "<foo<bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("山括弧閉じる", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: ">foo>bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

      describe("パイプ", () => {
        let payload;
        let file;
        let expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(files_url)
              .send(body)
              .end( (err, res) => resolve(res) );

          }).then( res => {
            file = _.get(res, ["body", "body", "0"]);

            return new Promise( (resolve, reject) => {
              request
                .patch(files_url + `/${file._id}/rename`)
                .send({ name: "|foo|bar" })
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
          expect(payload.body.status.errors.file_id).equal(expected.detail);
          done();
        });
      });

    });
  });

});
