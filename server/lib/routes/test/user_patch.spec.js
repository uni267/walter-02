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

describe("", () => {

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
})
