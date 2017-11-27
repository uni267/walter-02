import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { first, has, chain, find, findIndex, indexOf, isMatch } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";


mongoose.connect(mongoUrl, { useMongoClient: true });
app.use('/', Router);

const base_url = "/api/v1/files";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;
var search_items;
var meta;

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
  }]
};


describe(base_url,() => {
  before ( done => {
    initdbPromise.then( () => {
      request.post(login_url)
        .send(authData)
        .end( (err, res) => {
          user = res.body.body.user;
          request.set('x-auth-cloud-storage', res.body.body.token);
          done();
        });
    });
  });

  describe(`get /search_detail`,() => {


    before(done => {
      const sendData = {dir_id : '', files: []};
      const keyWords = [ 1, "日本語", "alpha", "@###", "alpha123" ];
      let tags;
      new Promise((resolve,reject) => {
        // タグ一覧を取得
        request.get("/api/v1/tags").end((err,res)=>{
          tags = first(res.body.body);
          resolve(res);
        });

      }).then( res => {
        return new Promise((resolve, reject)=>{
          request.get('/api/v1/files/search_items').end((err,res) =>{
            search_items = res.body.body;
            resolve(res);
          });
        });


      }).then( res => {
        // メタ情報一覧を取得
        return new Promise((resolve, reject)=>{
          request.get('/api/v1/meta_infos').end((err,res) => {
            meta = {
              _id: find(res.body.body, {name:"display_file_name"})._id,
              value: "meta_value"
            };
            resolve(res);
          });
        });
      }).then( res => {
        return new Promise((resolve, reject)=>{
          for(let i = 0 ; i < keyWords.length ; i++){
            const files = Object.assign({}, requestPayload.files[0] );
            files.name = `text_${keyWords[i]}.txt`;
            files.tags =[tags._id];
            files.meta_infos = [ meta ];
            sendData.files.push( files );
          }
          request.post(base_url)
          .send(sendData)
          .end( ( err, res ) => {
            resolve(res);
          });
        });
      }).then( res => {
        done();
      });
    });


    describe('異常系',() => {
      it.skip('comment', done => {done();});
    });
    describe('正常系',() => {
      describe('ファイル名で検索',() => {

        let response;
        before(done => {
          const sendQuery = {
            [find(search_items, {name:'name'} )._id]:"text",
            // [meta._id]: meta.value,
            // sort: find(search_items, {name:'name'} )._id,
            page:0,
            order: "asc"
          };

          request.get(`${base_url}/search_detail`)
          .query(sendQuery)
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

        it('Arrayである',done => {
          expect( response.body.body instanceof Array ).equal(true);
          done();
        });


        it('_idが含まれる', done => {
          expect( chain(response.body.body).first().has('_id').value() ).equal(true);
          done();
        });

        it('_idはObjectIdである',done => {
          expect(mongoose.Types.ObjectId.isValid(first(response.body.body)._id)).equal(true);
          done();
        });

        it('nameが含まれる', done => {
          expect(chain(response.body.body).first().has('name').value()).equal(true);
          done();
        });

        it('nameはstringである',done => {
          expect( typeof first(response.body.body).name ).equal('string');
          done();
        });

        it('mime_typeが含まれる', done => {
          expect( chain(response.body.body).first().has('mime_type').value() ).equal(true);
          done();
        });

        it('mime_typeはstringである',done => {
          expect( typeof first(response.body.body).mime_type ).equal('string');
          done();
        });

        it('sizeが含まれる', done => {
          expect( chain(response.body.body).first().has('size').value() ).equal(true);
          done();
        });

        it('sizeはnumberである',done => {
          expect( typeof first(response.body.body).size ).equal('number');
          done();
        });

        it('is_dirが含まれる', done => {
          expect( chain(response.body.body).first().has('is_dir').value() ).equal(true);
          done();
        });

        it('is_dirはbooleanである',done => {
          expect( typeof first(response.body.body).is_dir ).equal('boolean');
          done();
        });

        it('dir_idが含まれる', done => {
          expect( chain(response.body.body).first().has('dir_id').value() ).equal(true);
          done();
        });

        it('dir_idはObjectIdである',done => {
          expect(mongoose.Types.ObjectId.isValid(first(response.body.body).dir_id)).equal(true);
          done();
        });

        it('is_displayが含まれる', done => {
          expect( chain(response.body.body).first().has('is_display').value() ).equal(true);
          done();
        });

        it('is_displayはbooleanである',done => {
          expect( typeof first(response.body.body).is_display ).equal('boolean');
          done();
        });

        it('is_starが含まれる', done => {
          expect( chain(response.body.body).first().has('is_star').value() ).equal(true);
          done();
        });

        it('is_starはbooleanである',done => {
          expect( typeof first(response.body.body).is_star ).equal('boolean');
          done();
        });

        it('is_cryptedが含まれる', done => {
          expect( chain(response.body.body).first().has('is_crypted').value() ).equal(true);
          done();
        });

        it('is_cryptedはbooleanである',done => {
          expect( typeof first(response.body.body).is_crypted ).equal('boolean');
          done();
        });

        it('historiesが含まれる', done => {
          expect( chain(response.body.body).first().has('histories').value() ).equal(true);
          done();
        });

        it('historiesはArrayである',done => {
          expect( first(response.body.body).histories instanceof Array ).equal(true);
          done();
        });

        it('historiesはbodyを持つ', done => {
          const histories = first(response.body.body).histories;
          expect(has( first(histories), 'body')).equal(true);
          done();
        });
        it('historiesはactionを持つ', done => {
          const histories = first(response.body.body).histories;
          expect(has( first(histories), 'action')).equal(true);
          done();
        });
        it('histories.actionはstringである',done => {
          const histories = first(response.body.body).histories;
          expect( typeof first(histories).action ).equal('string');
          done();
        });
        it('historiesはuserを持つ', done => {
          const histories = first(response.body.body).histories;
          expect(has( first(histories), 'user')).equal(true);
          done();
        });
        it('historiesのuserはobjectである',done => {
          const histories = first(response.body.body).histories;
          expect( typeof first(histories).user ).equal('object');
          done();
        });

        it("historiesのuserには_id,account_name,name,email,password,enabled,tenant_id,groups,typeが含まれている", done => {
          const histories = first(response.body.body).histories;
          const needle = ["_id", "account_name", "name", "email", "password", "enabled", "tenant_id", "groups", "type"];
          expect(
            chain( first( histories ).user ).pick(needle).keys().value().length === needle.length
          ).equal(true);

          done();
        });

        it('historiesはmodifiedを持つ', done => {
          const histories = first(response.body.body).histories;
          expect(has( first(histories), 'modified')).equal(true);
          done();
        });
        it('histories.modifiedはstringである',done => {
          const histories = first(response.body.body).histories;
          expect( typeof first(histories).modified ).equal('string');
          done();
        });

        it('tagsが含まれる', done => {
          expect( chain(response.body.body).first().has('tags').value() ).equal(true);
          done();
        });

        it('tagsはArrayである',done => {
          expect( first(response.body.body).tags instanceof Array ).equal(true);
          done();
        });

        it('tagsには_id,color,label,tenant_idが含まれている', done => {
          const needle = [ "_id", "color", "label", "tenant_id"];
          expect(
            chain( first(response.body.body).tags ).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('is_deletedが含まれる', done => {
          expect( chain(response.body.body).first().has('is_deleted').value() ).equal(true);
          done();
        });

        it('is_deletedはbooleanである',done => {
          expect( typeof first(response.body.body).is_deleted ).equal('boolean');
          done();
        });

        it('modifiedが含まれる', done => {
          expect( chain(response.body.body).first().has('modified').value() ).equal(true);
          done();
        });

        it('modifiedはstringである',done => {
          expect( typeof first(response.body.body).modified ).equal('string');
          done();
        });

        it('preview_idが含まれる', done => {
          expect( chain(response.body.body).first().has('preview_id').value() ).equal(true);
          done();
        });

        it('preview_idはnullまたはObjectIdである',done => {
          if(first(response.body.body).preview_id === null){
            expect(first(response.body.body).preview_id).equal(null);
          }else{
            expect(mongoose.Types.ObjectId.isValid(first(response.body.body).preview_id)).equal(true);
          }
          done();
        });

        it('authoritiesが含まれる', done => {
          expect( chain(response.body.body).first().has('authorities').value() ).equal(true);
          done();
        });

        it('authoritiesはArrayである',done => {
          expect( first(response.body.body).authorities instanceof Array ).equal(true);
          done();
        });

        it('authorities[0]にはrole_files, users, actionsが含まれている', done => {
          const needle = ["role_files", "users", "actions"];
          expect(
            chain( first(response.body.body).authorities ).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('authorities[0].actionsには_id,name,labelが含まれている', done => {
          const authorities = first(response.body.body).authorities;
          const needle = ["_id", "name", "label"];
          expect(
            chain( first(authorities).actions ).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('dirsが含まれる', done => {
          expect( chain(response.body.body).first().has('dirs').value() ).equal(true);
          done();
        });

        it('dirsはArrayである',done => {
          expect( first(response.body.body).dirs instanceof Array ).equal(true);
          done();
        });

        it('dirsには_id,ancestor,descendant,depthが含まれている', done => {
          const needle = ["_id", "ancestor", "descendant", "depth"];
          expect(
            chain( first(response.body.body).dirs ).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('meta_infosが含まれる', done => {
          expect( chain(response.body.body).first().has('meta_infos').value() ).equal(true);
          done();
        });

        it('meta_infosはArrayである',done => {
          expect( first(response.body.body).meta_infos instanceof Array ).equal(true);
          done();
        });

        it('meta_infosには_id,label,value_type,valueが含まれている', done => {
          const needle = ["_id", "label", "value_type", "value"];
          expect(
            chain( first(response.body.body).meta_infos ).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('actionsが含まれる', done => {
          expect( chain(response.body.body).first().has('actions').value() ).equal(true);
          done();
        });

        it('actionsはArrayである',done => {
          expect( first(response.body.body).actions instanceof Array ).equal(true);
          done();
        });

        it('actionsには_id,name,labelが含まれている', done => {
          const needle = ["_id", "name", "label"];
          const actions = first(response.body.body).actions;
          expect(
            chain(actions).first().pick(needle).keys().value().length === needle.length
          ).equal(true);
          done();
        });

        it('dir_routeが含まれる', done => {
          expect( chain(response.body.body).first().has('dir_route').value() ).equal(true);
          done();
        });

        it('dir_routeはstringである',done => {
          expect( typeof first(response.body.body).dir_route ).equal('string');
          done();
        });

      });
    });
  });

});