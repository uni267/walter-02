import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
//import defaults from "superagentdefaults";
import { expect } from "chai";
import request from 'request';

const doRequest = (options) => {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

describe("テスト", async () => {
  const http_addr = '13.114.22.138'
  const options = {
    url: 'http://${http_addr}/api/login',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: '{"tenant_name":"agrex","account_name":"agrexupload","password":"Z2cKfen3"}'
  };
  
  const res = await doRequest(options)
  const token = res.body.token
  it(`test`,async () => {
    expect(res.status.success).equal(true)
  })

})

