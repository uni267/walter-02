import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { intersection, uniq, head, last } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const dir_url = "/api/v1/dirs";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

describe(dir_url, () => {
  before ( done => {
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
    let expected = {
      message: "フォルダ階層の取得に失敗しました",
      detail: "指定されたフォルダが存在しないためフォルダ階層の取得に失敗しました"
    };

    let root_id;
    let child_id;

    // 親のid, 1階層子のidを取得する
    before( done => {
      request.get(dir_url)
        .end( (err, res) => {
          root_id = res.body.body[0]._id;
          request.get(dir_url + "/tree")
            .query({ root_id })
            .end( (err, res) => {
              child_id = head(res.body.body.children)._id;
              done();
            });
        });
    });

    describe("正常系", () => {
      it("http(200)が返却される", done => {
        request
          .get(dir_url)
          .expect( (err, res) => {
            expect(res.status).equal(200);
            done();
          });
      });

      it("返却されるデータは_id, nameカラムを含んでいる", done => {
        request
          .get(dir_url)
          .end( (err, res) => {
            const needle = ["_id", "name"];
            const columns = res.body.body.map( obj => (
              intersection(Object.keys(obj), needle).length === 2
            ));
            expect(columns.every( col => col === true )).equal(true);
            done();
          });
      });

      it("2階層目のdir_id指定した場合、3つオブジェクトが返却される", done => {
        request.get(dir_url)
          .query({ dir_id: child_id })
          .end( (err, res) => {
            expect(res.body.body.length === 3).equal(true);
            done();
          });
      });

      it("配列間にはsepという文字列が挟まれている", done => {
        request.get(dir_url)
          .query({ dir_id: child_id })
          .end( (err, res) => {
            expect(res.body.body[1] === "sep").equal(true);
            done();
          });
      });

      it("最上位のフォルダidが配列先頭のオブジェクトに含まれている", done => {
        request.get(dir_url)
          .query({ dir_id: child_id })
          .end( (err, res) => {
            expect( head(res.body.body)._id === root_id ).equal(true);
            done();
          });
      });

      it("最下位のフォルダidが配列末尾のオブジェクトに含まれている", done => {
        request.get(dir_url)
          .query({ dir_id: child_id })
          .end( (err, res) => {
            expect(last(res.body.body)._id === child_id).equal(true);
            done();
          });
      });
    });

    describe("異常系", () => {
      describe("queryを省略した場合", () => {
        it("http(400)を返却する", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("queryがnullである場合", () => {
        it("http(400)を返却する", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: null })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: null })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("queryが空文字である場合", () => {
        it("http(400)を返却する", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(dir_url)
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: "" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: "" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("queryが存在しないidである場合", done => {
        it("http(400)を返却する", done => {
          request
            .get(dir_url)
            .query({ dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(dir_url)
            .query({ dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .get(dir_url)
            .query({ dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });
    });
  });

  describe("get /tree", () => {
    let expected = {
      message: "フォルダツリーの取得に失敗しました",
      detail: "指定されたフォルダが存在しないためフォルダツリーの取得に失敗しました"
    };

    const tree_url = dir_url + "/tree";
    let root_id;
    let child_id;

    // 親のid, 1階層子のidを取得する
    before( done => {
      request.get(dir_url)
        .end( (err, res) => {
          root_id = res.body.body[0]._id;
          request.get(dir_url + "/tree")
            .query({ root_id })
            .end( (err, res) => {
              child_id = head(res.body.body.children)._id;
              done();
            });
        });
    });

    describe("正常系", () => {
      it("http(200)が返却される", done => {
        request
          .get(tree_url)
          .query({ root_id })
          .end( (err, res) => {
            expect(res.status).equal(200);
            done();
          });
      });

      it("返却されるオブジェクトは_id, name, childrenを含んでいる", done => {
        request
          .get(tree_url)
          .query({ root_id })
          .end( (err, res) => {
            const needle = ["_id", "name", "children"];
            const columns = intersection(Object.keys(res.body.body), needle);
            expect(columns.length === 3).equal(true);
            done();
          });
      });

      it("親子のフォルダがネストされた状態で返却される", done => {
        request
          .get(tree_url)
          .query({ root_id })
          .end( (err, res) => {
            expect(res.body._id).equal(root_id);
            expect(head(res.body.children)._id).equal(child_id);
            done();
          });
      });

      it("最下層のフォルダを指定した場合、childrenは空の配列が返却される", done => {
        request
          .get(tree_url)
          .query({ root_id: child_id })
          .end( (err, res) => {
            expect(res.body._id).equal(child_id);
            expect(res.body.children.length === 0).equal(true);
            done();
          });
      });
    });

    describe("異常系", () => {

      describe("queryを省略した場合", () => {
        it("http(400)を返却する", done => {
          request
            .get(tree_url)
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(tree_url)
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラー概要は「${expected.message}」`, done => {
          request
            .get(tree_url)
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          request
            .get(tree_url)
            .end( (err, res) => {
              expect(res.body.status.errors.root_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("queryがnullの場合", () => {
        it("http(400)を返却する", done => {
          request
            .get(tree_url)
            .query({ root_id: null })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(tree_url)
            .query({ root_id: null })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラー概要は「${expected.message}」`, done => {
          request
            .get(tree_url)
            .query({ root_id: null })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          request
            .get(tree_url)
            .query({ root_id: null })
            .end( (err, res) => {
              expect(res.body.status.errors.root_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("queryが存在しないidの場合", () => {

        it("http(400)が返却される", done => {
          request
            .get(tree_url)
            .query({ root_id: "undefined" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .get(tree_url)
            .query({ root_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラー概要は「${expected.message}」`, done => {
          request
            .get(tree_url)
            .query({ root_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラー詳細は「${expected.detail}」`, done => {
          request
            .get(tree_url)
            .query({ root_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.errors.root_id).equal(expected.detail);
              done();
            });
        });
      });

    });
  });
  
  describe("post /", () => {
    let expected = {
      message: "フォルダは正常に作成されました"
    };

    let root_id;

    before( done => {
      request
        .get(dir_url)
        .end( (err, res) => {
          root_id = head(res.body.body)._id;
          done();
        });
    });

    describe("正常系", () => {

      it("http(200)が返却される", done => {
        request
          .post(dir_url)
          .send({ dir_id: root_id, dir_name: "test_http_200" })
          .end( (err, res) => {
            expect(res.status).equal(200);
            done();
          });
      });

      it(`正常時のメッセージは「${expected.message}」`, done => {
        request
          .post(dir_url)
          .send({ dir_id: root_id, dir_name: "test_message" })
          .end( (err, res) => {
            expect(res.body.status.message).equal(expected.message);
            done();
          });
      });

      it("指定されたdir_id上に指定されたnameのフォルダが作成される", done => {
        request
          .post(dir_url)
          .send({ dir_id: root_id, dir_name: "test_name" })
          .end( (err, res) => {
            request
              .get(dir_url + "/tree")
              .query({ root_id })
              .end( (err, res) => {
                const names = res.body.body.children.map( child => child.name );
                expect(names.includes("test_name")).equal(true);
                done();
              });
          });
      });
    });

    describe("異常系", () => {
      expected = {
        message: "フォルダの作成に失敗しました",
        detail: "指定されたフォルダが存在しないためフォルダの作成に失敗しました"
      };

      describe("dir_idを省略した場合", () => {
        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_undefined1" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_undefined1" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_undefined2" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_undefined3" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("dir_idがnullの場合", () => {
        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_null", dir_id: null })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_null1" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_null2", dir_id: null })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_null3", dir_id: null })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("dir_idが空文字の場合", () => {
        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_empty", dir_id: "" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_empty1", dir_id: "" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_empty2", dir_id: "" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_empty3", dir_id: "" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("dir_idが存在しない値の場合", () => {
        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_invalid", dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done(); 
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_invalid1", dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_invalid2", dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_name: "dir_id_is_invalid3", dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_id).equal(expected.detail);
              done();
            });
        });
      });

      describe("dir_nameを省略した場合", () => {
        expected = {
          message: "フォルダの作成に失敗しました",
          detail: "フォルダ名が空のため作成に失敗しました"
        };

        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_id: "undefined" })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_name).equal(expected.detail);
              done();
            });
        });

      });

      describe("dir_nameが空文字の場合", () => {
        expected = {
          message: "フォルダの作成に失敗しました",
          detail: "フォルダ名が空のため作成に失敗しました"
        };

        it("http(400)を返却する", done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id, dir_name: "" })
            .end( (err, res) => {
              expect(res.status).equal(400);
              done();
            });
        });

        it("statusはfalse", done => {
          request
            .post(dir_url)
            .send({ dir_name: "", dir_id: root_id })
            .end( (err, res) => {
              expect(res.body.status).equal(false);
              done();
            });
        });

        it(`エラーの概要は「${expected.message}」`, done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id, dir_name: "" })
            .end( (err, res) => {
              expect(res.body.status.message).equal(expected.message);
              done();
            });
        });

        it(`エラーの詳細は「${expected.detail}」`, done => {
          request
            .post(dir_url)
            .send({ dir_id: root_id, dir_name: "" })
            .end( (err, res) => {
              expect(res.body.status.errors.dir_name).equal(expected.detail);
              done();
            });
        });

      });

      describe("dir_nameが不正である場合", () => {

        describe("指定されたdir_id内に同名のフォルダが存在する場合", () => {
          expected = {
            message: "フォルダの作成に失敗しました",
            detail: "指定されたフォルダに同名のフォルダが存在するため作成に失敗しました"
          };

          it("http(400)を返却する", done => {
            request
              .post(dir_url)
              .send({ dir_id: root_id, dir_name: "duplicated" })
              .end( (err, res) => {
                request
                  .post(dir_url)
                  .send({ dir_id: root_id, dir_name: "duplicated" })
                  .end( (err, res) => {
                    expect(res.status).equal(400);
                    done();
                  });
              });
          });

          it("statusはfalse", done => {
            request
              .post(dir_url)
              .send({ dir_id: root_id, dir_name: "duplicated1" })
              .end( (err, res) => {
                request
                  .post(dir_url)
                  .send({ dir_id: root_id, dir_name: "duplicated1" })
                  .end( (err, res) => {
                    expect(res.body.status).equal(false);
                    done();
                  });
              });
          });

          it(`エラーの概要は「${expected.message}」`, done => {
            request
              .post(dir_url)
              .send({ dir_id: root_id, dir_name: "duplicated2" })
              .end( (err, res) => {
                request
                  .post(dir_url)
                  .send({ dir_id: root_id, dir_name: "duplicated2" })
                  .end( (err, res) => {
                    expect(res.body.status.message).equal(expected.message);
                    done();
                  });
              });
          });

          it(`エラーの詳細は「${expected.detail}」`, done => {
            request
              .post(dir_url)
              .send({ dir_id: root_id, dir_name: "duplicated3" })
              .end( (err, res) => {
                request
                  .post(dir_url)
                  .send({ dir_id: root_id, dir_name: "duplicated3" })
                  .end( (err, res) => {
                    expect(res.body.status.errors.dir_name).equal(expected.detail);
                    done();
                  });
              });
          });

        });

        describe("名前に「＼, / , :, *, ?, <, >, |」が含まれている場合", () => {
          expected = {
            message: "フォルダの作成に失敗しました",
            detail: "指定されたフォルダ名に禁止文字が含まれているため作成に失敗しました"
          };

          describe("バックスラッシュが含まれている場合", () => {
            let dir_name = "invalid\\DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("スラッシュが含まれている場合", () => {
            let dir_name = "invalid/DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("コロンが含まれている場合", () => {
            let dir_name = "invalid:DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("アスタリスクが含まれている場合", () => {
            let dir_name = "invalid*DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("クエッションマークが含まれている場合", () => {
            let dir_name = "invalid?DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("山形括弧(開く)が含まれている場合", () => {
            let dir_name = "invalid<DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("山形括弧(閉じる)が含まれている場合", () => {
            let dir_name = "invalid>DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });

          describe("パイプが含まれている場合", () => {
            let dir_name = "invalid|DirName";

            it("http(400)を返却する", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name })
                .end( (err, res) => {
                  expect(res.status).equal(400);
                  done();
                });
            });

            it("statusはfalse", done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "1" })
                .end( (err, res) => {
                  expect(res.body.status).equal(false);
                  done();
                });
            });

            it(`エラーの概要は「${expected.message}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "2" })
                .end( (err, res) => {
                  expect(res.body.status.message).equal(expected.message);
                  done();
                });
            });

            it(`エラーの詳細は「${expected.detail}」`, done => {
              request
                .post(dir_url)
                .send({ dir_id: root_id, dir_name: dir_name + "3" })
                .end( (err, res) => {
                  expect(res.body.status.errors.dir_name).equal(expected.detail);
                  done();
                });
            });
          });
        });

      });
    });
  });

  describe.skip("patch /:moving_id/move");

});
