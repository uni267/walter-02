import { SERVER_CONF } from "./configs/server"; // mongoのipなど
import router from "./routes";
import * as constants from "./configs/constants";
import mongoose from "mongoose";
import { Swift } from "./storages/Swift";
import esClient from "./elasticsearchclient";
import tikaClient from "./tikaclient";
import logger from "./logger";
import { produce, getConsumer, closeConsumer, createTopics } from "./kafkaclient";


// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
const mode = process.env.NODE_ENV;

let url;
let db_name;
let port;

switch (mode) {
case "integration":
  url = SERVER_CONF.integration.url;
  db_name = SERVER_CONF.integration.db_name;
  port = SERVER_CONF.integration.port;
  break;

case "production":
  if (! process.env.MONGO_HOST_NAME) throw new Error("env.MONGO_HOST_NAME is not set");

  url = SERVER_CONF.production.url;
  db_name = SERVER_CONF.production.db_name;
  port = SERVER_CONF.production.port;
  break;

default:
  url = SERVER_CONF.development.url;
  db_name = SERVER_CONF.development.db_name;
  port = SERVER_CONF.development.port;
  break;
}

export const getApiPort = () => port

mongoose.Promise = global.Promise;

export const checkMongo = (checked, count = 0) => {
  mongoose.connect(`${url}/${db_name}`, {useMongoClient: true}).then( res => {
    checked()
  }).catch( e => {
    console.log("mongo connection failed", count + 1);
    logger.info("mongo connection failed", count + 1);

    setTimeout( () => {
      if (constants.MONGO_CONNECTION_RETRY <= count) throw new Error("mongodb connection failed");
      checkMongo(checked, count + 1);
    }, constants.MONGO_CONNECTION_INTERVAL);
  });
};

export const checkSwift = (checked, count = 0) => {
  const swift = new Swift();

  swift.getContainers().then( res => {
    checked()
  }).catch( e => {
    console.log(e);
    console.log("swift connection failed", count + 1);
    logger.info("swift connection failed", count + 1);

    if (constants.SWIFT_CONNECTION_RETRY <= count) throw new Error("swift connection failed");

    setTimeout( () => {
      checkSwift(checked, count + 1);
    }, constants.SWIFT_CONNECTION_INTERVAL);

  });
};

export const checkElastic = (checked, count = 0) => {
  esClient.ping({ requestTimeout: constants.ELASTIC_CONNECTION_TIMEOUT }, err => {
    if (err) {
      console.log("elasticsearch connection failed", count + 1);
      logger.info("elasticsearch connection failed", count + 1);

      if (constants.ELASTIC_CONNECTION_RETRY <= count) throw new Error("elasticsearch connection failed");

      setTimeout( () => {
        checkElastic(checked, count + 1);
      }, constants.ELASTIC_CONNECTION_INTERVAL );

    }
    else {
      checked()
    }
  });
};

export const checkTika = async (checked, count = 0) => {
  //await createTopics(payloads)
  try{
    await tikaClient.checkConnection()
    checked()
  }catch(e){
    console.log("tika connection failed", count + 1);
    logger.info("tika connection failed", count + 1);

    if (constants.TIKA_CONNECTION_RETRY <= count) throw new Error("tika connection failed");

    setTimeout( () => {
      checkTika(checked, count + 1);
    }, constants.TIKA_CONNECTION_INTERVAL);
  }
};
export const checkKafka = async (checked, count = 0) => {
  try{
    await createTopics([
      {
        topic: "ping_test",
        partitions: 1,
        replicationFactor: 1
      },
    ])
    checked()    
  }catch(e){
    console.log(e);
    console.log("kafka connection failed", count + 1);
    logger.info("kafka connection failed", count + 1);

    if (constants.KAFKA_CONNECTION_RETRY <= count) throw new Error("kafka connection failed");

    setTimeout( () => {
      checkKafka(checked, count + 1);
    }, constants.KAFKA_CONNECTION_INTERVAL);
  }
};

