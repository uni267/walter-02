import axios from 'axios';
import _ from 'lodash';

import { TIMESTAMP_API_CONF } from "../configs/server";

const mode = process.env.NODE_ENV;

let baseURL;

switch (mode) {
  case "integration":
    baseURL = `${TIMESTAMP_API_CONF.integration.url}:${TIMESTAMP_API_CONF.integration.port}/${TIMESTAMP_API_CONF.integration.apiVersion}`;
    break;

  case "production":
    if (! process.env.TIMESTAMP_API_BASE_URL) throw new Error("env.TIMESTAMP_API_BASE_URL is not set");1
    baseURL = `${TIMESTAMP_API_CONF.production.host}:${TIMESTAMP_API_CONF.production.port}/${TIMESTAMP_API_CONF.production.apiVersion}`;
    break;

  default:
    baseURL = `${TIMESTAMP_API_CONF.development.host}:${TIMESTAMP_API_CONF.development.port}/${TIMESTAMP_API_CONF.development.apiVersion}`;
    break;
}

export class API {

  constructor() {
    this.client = axios.create({
      baseURL,
      timeout: 1000,
    });
  }

  grantToken(requestId = "", file) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      timestamp: {
        stampedDate: "2019-02-28T06:08:43.333Z",
        limitDate: "2019-02-28T06:08:43.333Z",
        isCyberTSA: true,
        token: "string",
        hashAlgorithm: "SHA256",
        hash: "string"
      }
    })
  };

  grantPades(requestId = "", file) {
    // const body = { fileId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      timestamp: {
        stampedDate: new Date(),
        limitDate: (new Date()).setFullYear(2029),
        isCyberTSA: true,
        token: "string",
        hashAlgorithm: "SHA256",
        hash: "string"
      },
      file,
    })
  }


  verifyPades(requestId = "", file, token) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      result: {
        status: "success",
        verifiedDate: new Date(),
        errors: [
          {
            code: "expired",
            description: "string"
          }
        ]
      }
    })
  };
}

export default new API()
