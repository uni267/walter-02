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
    baseURL = `${TIMESTAMP_API_CONF.production.url}:${TIMESTAMP_API_CONF.production.port}/${TIMESTAMP_API_CONF.production.apiVersion}`;
    break;

  default:
    baseURL = `${TIMESTAMP_API_CONF.development.url}:${TIMESTAMP_API_CONF.development.port}/${TIMESTAMP_API_CONF.development.apiVersion}`;
    break;
}

export class API {

  constructor(tsaUser = null, tsaPass = null) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      auth: {
        username: tsaUser,
        password: tsaPass,
      }
    });
  }

  grantToken(requestId = "", file) {
    return this.client.post("/grant/tst/binary", { requestId, file })
  }

  grantPades(requestId = "", file) {
    return this.client.post("/grant/pades/binary", { requestId, file })
  }
  grantaddLTV(requestId = "", file) {
    return this.client.post("/grant/addLTV/binary", { requestId, file })
  }

  grantEst(requestId = "", file) {
    return this.client.post("/grant/ES-T/binary", { requestId, file });
  }
  verifyToken(requestId = "", file, token) {
    return this.client.post("/verify/tst/binary", { requestId, file, token })
  }

  verifyPades(requestId = "", file) {
    return this.client.post("/verify/pades/binary", { requestId, file })
  }

  inspect(requestId = "", file) {
    return this.client.post("/inspect", { requestId, file })
  }

  _getCurrentTime() {
    return moment().format()
  }

  _get10YearsAfter() {
    return moment().add(moment.duration(10, 'months')).format()
  }
}

export default API
