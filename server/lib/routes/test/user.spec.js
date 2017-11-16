import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { intersection, uniq, head, last, includes, has, pick, keys, values, chain, range, map, filter } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const user_url = "/api/v1/users";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

// ユーザ詳細
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

  describe("get /", () => {
    describe("ログインユーザのuser_idを指定した場合", () => {
      let payload;

      before( done => {
        request
          .get(user_url + `/${user._id}`)
          .end( (err, res) => {
            payload = res;
            done();
          });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      it("1個のオブジェクトが返却される", done => {
        expect(typeof payload.body.body === "object").equal(true);
        done();
      });

      describe("userオブジェクトの型", () => {
        it("_id, name, account_name, email, tenant_idが含まれている", done => {
          const needle = ["_id", "name", "account_name", "email", "tenant_id"];
          expect(
            chain(payload.body.body).pick(needle).keys().value().length === needle.length
          ).equal(true);

          done();
        });

        it("groupsが含まれている", done => {
          const needle = ["groups"];
          expect(
            chain(payload.body.body).pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it("groups[0]に_id, name, description, tenant_idが含まれている", done => {
          const needle = ["_id", "name", "description", "tenant_id"];
          const columns = chain(payload.body.body.groups).head().pick(needle).keys().value();
          expect(columns.length === needle.length).equal(true);
          done();
        });

        it("groups[0].tenantにはname, role_files, tenant_id, rolesが含まれている", done => {
          const needle = ["name", "role_files", "tenant_id", "roles"];
          const tenant = chain(payload.body.body.groups).head().value();
          const columns = chain(tenant).pick(needle).keys().value();
          expect(columns.length === needle.length).equal(true);
          done();
        });
      });
    });

    describe("指定されたuser_idが", () => {
      describe("存在しないoidの場合", () => {
        let payload;
        let expected = {
          message: "ユーザの取得に失敗しました",
          detail: "指定されたユーザが存在しないためユーザの取得に失敗しました"
        };

        before( done => {
          request
            .get(user_url + "/undefined_oid")
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

  // 所属グループの追加
  describe("post /:user_id/groups", () => {
    describe("user_id, group_idを正しく指定した場合", () => {
      let payload;
      let group_id;
      let changedUser;

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .get("/api/v1/groups")
            .end( (err, res) => {
              if (err) reject(err);
              resolve(res);
            });
        }).then( res => {
          group_id = head(res.body.body)._id;

          return new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .send({ group_id })
              .end( (err, res) => {
                if (err) reject(err);
                resolve(res);
              });
          });
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
            .get(user_url + `/${user._id}`)
            .end( (err, res) => {
              if (err) reject(err);
              resolve(res);
            });
          });
        }).then( res => {
          changedUser = res;
          done();
        });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      it("変更したユーザを取得した場合、追加したグループを含めた結果が返却される", done => {
        const group_ids = changedUser.body.body.groups
              .map( group => group._id )
              .filter( id => id === group_id );

        expect(group_ids.length === 1).equal(true);
        done();
      });
    });

    describe("指定されたuser_idが", () => {
      describe("存在しないoidの場合", () => {
        let payload;
        let group_id;
        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたユーザが存在しないためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .get("/api/v1/groups")
              .end( (err, res) => {
                resolve(res);
              });
          }).then( res => {
            group_id = head(res.body.body)._id;

            return new Promise ( (resolve, reject) => {
              request
                .post(user_url + "/invalid_oid/groups")
                .send({ group_id })
                .end( (err, res) => {
                  resolve(res);
                });
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

    describe("指定されたgroup_idが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたグループが存在しないためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });

      describe("nullの場合", () => {
        let payload;
        let group_id = null;
        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたグループが存在しないためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .send({ group_id })
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });

      describe("空文字の場合", () => {
        let payload;
        let group_id = "";
        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたグループが存在しないためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .send({ group_id })
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });

      describe("存在しないoidの場合", () => {
        let payload;
        let group_id = "invalid_oid";
        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたグループが存在しないためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .send({ group_id })
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });

      describe("重複している場合", () => {
        let payload;

        let expected = {
          message: "グループの追加に失敗しました",
          detail: "指定されたユーザは既に指定したグループに所属しているためグループの追加に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .post(user_url + `/${user._id}/groups`)
              .send({ group_id: head(user.groups)._id })
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });
    });

  });

  // パスワード変更(ユーザ向け)
  describe("patch /:user_id/password", () => {

    describe("ログインユーザのuser_id、正しいパスワードを指定した場合", () => {
      let payload;
      let afterPayload;
      let body = {
        current_password: authData.password,
        new_password: authData.password + authData.password
      };

      before( done => {
        new Promise( (resolve, reject) => {
          request
            .patch(user_url + `/${user._id}/password`)
            .send(body)
            .end( (err, res) => resolve(res) );
        }).then( res => {
          payload = res;

          return new Promise( (resolve, reject) => {
            request
              .post(login_url)
              .send({
                account_name: authData.account_name,
                password: body.new_password
              })
              .end( (err, res) => resolve(res) );
          });
        }).then( res => {
          afterPayload = res;
          done();
        });
      });

      // パスワードを元に戻しておく
      after( done => {
        new Promise( (resolve, reject) => {
          request
            .patch(user_url + `/${user._id}/password`)
            .send({
              current_password: body.new_password,
              new_password: body.current_password
            })
            .end( (err, res) => resolve(res) );
        }).then( res => {
          done();
        });
      });

      it("http(200)が返却される", done => {
        expect(payload.status).equal(200);
        done();
      });

      describe("変更したパスワードでログインした場合", () => {
        it("http(200)が返却される", done => {
          expect(afterPayload.status).equal(200);
          done();
        });

        it("tokenが返却される", done => {
          expect(afterPayload.body.body.token.length > 0).equal(true);
          done();
        });

        it("userオジェクトが返却される", done => {
          expect(afterPayload.body.body.user._id.length > 0).equal(true);
          done();
        });
      });
    });

    describe("current_passwordが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body = {
          new_password: authData.password + authData.password
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "現在のパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("nullの場合", () => {
        let payload;
        let body = {
          current_password: null,
          new_password: authData.password + authData.password
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "現在のパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("空文字の場合", () => {
        let payload;
        let body = {
          current_password: "",
          new_password: authData.password + authData.password
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "現在のパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("現在のパスワードと一致しない場合", () => {
        let payload;
        let body = {
          current_password: authData.password + authData.password,
          new_password: authData.password + authData.password
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "指定されたパスワードが現在設定されているパスワードと一致しないためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });
    });

    describe("new_passwordが", () => {
      describe("undefinedの場合", () => {
        let payload;
        let body = {
          current_password: authData.password
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "新しいパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("nullの場合", () => {
        let payload;
        let body = {
          current_password: authData.password,
          new_password: null
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "新しいパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("空文字の場合", () => {
        let payload;
        let body = {
          current_password: authData.password,
          new_password: ""
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "新しいパスワードが空のためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("255文字以上の場合", () => {
        let payload;
        let body = {
          current_password: authData.password,
          new_password: range(256).join("")
        };

        let expected = {
          message: "パスワードの変更に失敗しました",
          detail: "新しいパスワードが規定文字数を超過したためパスワードの変更に失敗しました"
        };

        before( done => {
          new Promise( (resolve, reject) => {
            request
              .patch(user_url + `/${user._id}/password`)
              .send(body)
              .end( (err, res) => resolve(res) );
          }).then( res => {
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
          expect(payload.body.status.errors.current_password).equal(expected.detail);
          done();
        });
      });

      describe("禁止文字(\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        describe("バックスラッシュ", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo\\foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });
        });

        describe("スラッシュ", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo/foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });
        });

        describe("コロン", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo:foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });
        });
        describe("アスタリスク", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo*foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });

        });

        describe("クエスション", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo?foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });

        });

        describe("山括弧開く", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo<foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });

        });

        describe("山括弧閉じる", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo>foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });

        });

        describe("パイプ", () => {
          let payload;
          let body = {
            current_password: authData.password,
            new_password: "foo|foo"
          };

          let expected = {
            message: "パスワードの変更に失敗しました",
            detail: "新しいパスワードに禁止文字(\, / , :, *, ?, <, >, |)が含まれているためパスワードの変更に失敗しました"
          };

          before( done => {
            new Promise( (resolve, reject) => {
              request
                .patch(user_url + `/${user._id}/password`)
                .send(body)
                .end( (err, res) => resolve(res) );
            }).then( res => {
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
            expect(payload.body.status.errors.current_password).equal(expected.detail);
            done();
          });
        });
      });
    });

    describe("user_idが", () => {
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

  // パスワード変更(管理者向け)
  describe("patch /:user_id/password_force", () => {
    describe("ログインユーザのuser_id、正しいパスワードを指定した場合", () => {
      it("http(200)が返却される");
      it("変更したパスワードでログインすることが可能");
    });

    describe("user_idが", () => {
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

    describe("passwordが", () => {
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

      describe("禁止文字(\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

  });

  // ユーザ有効/無効のトグル
  describe("patch /:user_id/enabled", () => {
    describe("有効な状態である他ユーザのuser_idを指定した場合", () => {
      it("http(200)が返却される");
      it("ユーザ詳細を取得した結果、enable = falseとなる");

      describe("変更されたユーザがログインした場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("無効な状態である他ユーザのuser_idを指定した場合", () => {
      it("http(200)が返却される");
      it("ユーザ詳細を取得した結果、enable = trueとなる");

      describe("変更されたユーザがログインした場合", () => {
        it("http(200)が返却される");
        it("トークンが返却される");
        it("ユーザオブジェクトが返却される");
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

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

  });

  // アカウント名変更
  describe("patch /:user_id/account_name", () => {
    describe("他ユーザのuser_id, 正しいaccount_nameを指定した場合", () => {
      it("http(200)が返却される");
      it("ユーザ詳細を取得した結果、account_nameが変更された値として返却される");

      describe("変更したユーザにて変更後のaccount_nameでログインした場合", () => {
        it("http(200)が返却される");
        it("トークンが返却される");
        it("ユーザオブジェクトが返却される");
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

      describe("存在しないoidの場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
      });
    });

    describe("指定されたaccount_nameが", () => {
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

      describe("禁止文字(\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
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

      describe("禁止文字(\, / , :, *, ?, <, >, |)が含まれている場合", () => {
        it("http(400)が返却される");
        it("statusはfalse");
        it("エラーの概要は「xx」");
        it("エラーの詳細は「xx」");
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
