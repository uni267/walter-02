import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

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

  getCurrentTime() {
    return moment().format()
  }

  get10YearsAfter() {
    return moment().add(moment.duration(10, 'months')).format()
  }

  grantToken(requestId = "", file) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      timestampToken: {
        stampedDate: this.getCurrentTime(),
        expirationDate: this.get10YearsAfter(),
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
      timestampToken: {
        stampedDate: this.getCurrentTime(),
        expirationDate: this.get10YearsAfter(),
        isCyberTSA: true,
        token: "string",
        hashAlgorithm: "SHA256",
        hash: "string"
      },
      file,
    })
  }


  verifyToken(requestId = "", file, token) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      result: {
        status: "success",
        verifiedDate: this.getCurrentTime(),
        errors: [
          {
            code: "expired",
            description: "string"
          }
        ]
      }
    })
  };


  verifyPades(requestId = "", file, token) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      result: {
        status: "failed",
        verifiedDate: this.getCurrentTime(),
        errors: [
          {
            // expired, falsified_hash, invalid_cert, other
            code: "expired",
            description: "有効期限がきれた",
          },
          {
            // expired, falsified_hash, invalid_cert, other
            code: "expired",
            description: "有効期限がきれた",
          }
        ]
      }
    })
  };

  inspect(requestId = "", file) {
    // const body = { requestId, file };
    // return this.client.post(`/grant/tst/binary`, body);

    return Promise.resolve({
      requestId: requestId.toString(),
      hasToken: true,
      timestampToken: {
        stampedDate: this.getCurrentTime(),
        expirationDate: this.get10YearsAfter(),
        isCyberTSA: true,
        token: "string",
        hashAlgorithm: "SHA256",
        hash: "string"
      },
      file,
    })
  };
}

export default new API()
