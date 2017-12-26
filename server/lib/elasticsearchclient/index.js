import elasticsearch from "elasticsearch";
import { ELASTICSEARCH_CONF } from "../../configs/server";

const mode = process.env.NODE_ENV;

let erasticsearchUrl;
let erasticsearchErrorLevel;

switch (mode) {

  case "integration":
    erasticsearchUrl = `${ELASTICSEARCH_CONF.integration.host}:${ELASTICSEARCH_CONF.integration.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.integration.logLevel;
    break;

  case "production":
    erasticsearchUrl = `${ELASTICSEARCH_CONF.production.host}:${ELASTICSEARCH_CONF.production.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.production.logLevel;
    break;

  default:
    erasticsearchUrl = `${ELASTICSEARCH_CONF.development.host}:${ELASTICSEARCH_CONF.development.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.development.logLevel;
    break;
  }

const esClient = new elasticsearch.Client({
  host: erasticsearchUrl,
  log: erasticsearchErrorLevel
});


export default esClient;