import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import * as _ from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const user_url = "/api/v1/users";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

describe(user_url + "/:user_id", () => {
  before( done => {
    initdbPromise.then( () => {
      request.post(login_url)
        .send(authData)
        .end( (err, res) => {
          request.set("x-auth-cloud-storage", res.body.body.token);
          user = res.body.body.user;
          done();
        });
    });
  });

  // ユーザ有効/無効のトグル
  describe("patch /:user_id/enabled", () => {
    let toggleUser;

    // ログインユーザ以外をピックアップ
    before( done => {
      request
        .get(user_url)
        .end( (err, res) => {
          const __user = res.body.body.filter( _user => (
            _user.enabled === true && _user._id !== user._id
          ));

          toggleUser = _.head(__user);
          done();
        });
    });

    // 対象のユーザが無効だった場合、有効に戻す後処理
    afterEach( done => {
      new Promise( (resolve, reject) => {
        request
          .get(user_url + `/${toggleUser._id}`)
          .end( (err, res) => resolve(res) );
      }).then( res => {
        if (res.body.body.enabled === false) {
          return new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${toggleUser._id}/enabled`)
              .end( (err, res) => resolve(res) );
          });
        } else {
          return new Promise( (resolve, reject) => resolve() );
        }
      }).then( res => {
        done();
      });
    });

    describe("有効な状態である他ユーザのuser_idを指定した場合", () => {
      let payload;
      let nextPayload;

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .patch(user_url + `/${toggleUser._id}/enabled`)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(user_url + `/${toggleUser._id}`)
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

      it("ユーザ詳細を取得した結果、enabled = falseとなる", done => {
        expect(nextPayload.body.body.enabled).equal(false);
        done();
      });

      describe("変更されたユーザがログインした場合", () => {
        let payload;
        let expected = {
          message: "ユーザ認証に失敗しました",
          detail: "指定されたユーザは現在無効状態のためユーザ認証に失敗しました"
        };

        before( done => {
          request
            .post(login_url)
            .send({
              account_name: toggleUser.account_name,
              password: "test"
            })
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

        it("エラーの詳細は「xx」", done => {
          expect(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });

      });
    });

    describe("指定されたuser_idが", () => {
      describe("存在しないoidの場合", () => {
        let payload;
        let expected = {
          message: "ユーザの有効化/無効化に失敗しました",
          detail: "指定されたユーザが存在しないためユーザの有効化/無効化に失敗しました"
        };

        before( done => {
          request
            .patch(user_url + `/invalid_oid/enabled`)
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
          expect(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });

  });

  // アカウント名変更
  describe("patch /:user_id/account_name", () => {
    let changeUser;

    before( done => {
      request
        .get(user_url)
        .end( (err, res) => {
          const __user = res.body.body.filter( _user => (
            _user.enabled === true && _user._id !== user._id
          ));

          changeUser = _.head(__user);
          done();
        });
    });

    describe("他ユーザのuser_id, 正しいaccount_nameを指定した場合", () => {
      let payload;
      let nextPayload;

      let body = {
        account_name: "foobar"
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .patch(user_url + `/${changeUser._id}/account_name`)
            .send(body)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .get(user_url + `/${changeUser._id}`)
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          nextPayload = res;
          done();
        });
      });

      // 変更したaccount_nameを元に戻しておく
      after( done => {
        request
          .patch(user_url + `/${changeUser._id}/account_name`)
          .send({ account_name: changeUser.account_name })
          .end( (err, res) => {
            done();
          });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      it("ユーザ詳細を取得した結果、account_nameが変更された値として返却される", done => {
        expect(nextPayload.body.body.account_name).equal(body.account_name);
        done();
      });

      describe("変更したユーザにて変更後のaccount_nameでログインした場合", () => {
        let payload;

        before( done => {
          request
            .post(login_url)
            .send({
              account_name: body.account_name,
              password: "test"
            })
            .end( (err, res) => {
              payload = res;
              done();
            });
        });

        it("http(200)が返却される", done => {
          expect(payload.status).equal(200);
          done();
        });

        it("トークンが返却される", done => {
          expect(payload.body.body.token.length > 0).equal(true);
          done();
        });

        it("ユーザオブジェクトが返却される", done => {
          expect(payload.body.body.user._id.length > 0).equal(true);
          done();
        });

      });
    });

    describe("指定されたuser_idが", () => {
      describe("存在しないoidの場合", () => {
        let payload;
        let expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "指定されたユーザが存在しないためログイン名の変更に失敗しました"
        };

        before( done => {
          request
            .patch(user_url + `/invalid_oid/account_name`)
            .send({ account_name: "foobar" })
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
          expect(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });

    describe("指定されたaccount_nameが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body = {};
        let expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "指定されたログイン名が空であるためログイン名の変更に失敗しました"
        };

        before( done => {
          request
            .post(user_url + `/${changeUser._id}/account_name`)
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
          expect(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });

      describe("nullの場合", () => {
        let payload;
        let body = { account_name: null };
        let expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "指定されたログイン名が空であるためログイン名の変更に失敗しました"
        };

        before( done => {
          request
            .post(user_url + `/${changeUser._id}/account_name`)
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
          expect(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });

      describe("空文字の場合", () => {
        let payload;
        let body = { account_name: "" };
        let expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "指定されたログイン名が空であるためログイン名の変更に失敗しました"
        };

        before( done => {
          request
            .post(user_url + `/${changeUser._id}/account_name`)
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
          expect(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });

      describe("255文字以上の場合", () => {
        let payload;
        let body = {
          account_name: _.range(257).map(i => "1").join("")
        };

        let expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "指定されたログイン名の文字数が規定数を超過したためログイン名の変更に失敗しました"
        };

        before( done => {
          request
            .post(user_url + `/${changeUser._id}/account_name`)
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
          expect(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });

      describe("禁止文字(\\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        describe("バックスラッシュ", () => {
          let payload;
          let body = {
            account_name: "\\foo\\bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });

        describe("スラッシュ", () => {
          let payload;
          let body = {
            account_name: "/foo/bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });

        });

        describe("コロン", () => {
          let payload;
          let body = {
            account_name: ":foo:bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });

        });

        describe("アスタリスク", () => {
          let payload;
          let body = {
            account_name: "*foo*bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });

        });

        describe("クエスチョン", () => {
          let payload;
          let body = {
            account_name: "?foo?bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });

        describe("山括弧開く", () => {
          let payload;
          let body = {
            account_name: "<foo<bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });

        describe("山括弧閉じる", () => {
          let payload;
          let body = {
            account_name: ">foo>bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });

        describe("パイプ", () => {
          let payload;
          let body = {
            account_name: "|foo|bar"
          };

          let expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "指定されたログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためログイン名の変更に失敗しました"
          };

          before( done => {
            request
              .post(user_url + `/${changeUser._id}/account_name`)
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
            expect(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
      });
    });
  });

  // ユーザの表示名変更
  describe("patch /:user_id/name", () => {
    describe("他ユーザのuser_id, 正しいnameを指定した場合", () => {
      it("http(200)が返却される");
      it("ユーザ詳細を取得した結果、nameが変更された値として返却される");
    });

    describe("指定されたuser_idが", () => {
      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("指定されたnameが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("空文字の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("255文字以上の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("禁止文字(\\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        describe("バックスラッシュ", () => {
        });

        describe("スラッシュ", () => {
        });

        describe("コロン", () => {
        });

        describe("アスタリスク", () => {
        });

        describe("クエスチョン", () => {
        });

        describe("山括弧開く", () => {
        });

        describe("山括弧閉じる", () => {
        });

        describe("パイプ", () => {
        });
      });
    });

  });

  // メールアドレス変更
  describe("patch /:user_id/email", () => {
    describe("他ユーザのuser_id, 正しいemailを指定した場合", () => {
      it("http(200)が返却される");
      it("ユーザ詳細を取得した結果、emailが変更された値として返却される");
    });

    describe("指定されたuser_idが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("指定されたemailが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      // メールアドレスは必須項目ではない
      describe("空文字の場合", () => {
        it("http(200)が返却される");
        it("ユーザ詳細を取得した結果、emailが空文字として返却される");
      });

      describe("255文字以上の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("禁止文字(\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

  });

  // 所属グループの削除
  describe("delete /:user_id/groups/:group_id", () => {
    describe("user_id, group_idを正しく指定した場合", () => {
      it("http(200)が返却される");
      it("変更したユーザを取得した場合、削除したグループを含めた結果が返却される");
    });

    describe("指定されたuser_idが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("空文字の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("指定されたgroup_idが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("空文字の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("userが所属していないgroup_idの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });
    
  });

  // メニューロールの変更
  describe("patch /:user_id/role_menus", () => {
    describe("user_id, 追加したいrole_menu_idを正しく指定した場合", () => {
      it("http(200)が返却される");
      it("変更したユーザを取得した場合、追加したロールメニューを含めた結果が返却される");

      describe("変更したユーザにてログインした場合", () => {
        it("メニューを取得した際、追加したロールメニューが表示される");

        describe("追加したメニューのAPIを取得した場合", () => {
          it("http(200)が返却される");
          it("0個以上のオブジェクトが返却される");
        });
      });
    });

    describe("指定されたuser_idが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("空文字の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("指定されたrole_menu_idが", () => {
      describe("undefinedの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("nullの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("空文字の場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

  });
});
