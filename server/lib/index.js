import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import { SERVER_CONF } from "../configs/server"; // mongoのipなど
import router from "./routes";

const app = express();

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods",
             "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan({ format: "dev", immediate: true }));

const url = SERVER_CONF.development.url;
const db_name = SERVER_CONF.development.db_name;

mongoose.connect(`${url}/${db_name}`, {useMongoClient: true}).then( () => {

  const port = SERVER_CONF.development.port;
  const server = app.listen(port, () => {
    console.log(`start server port: ${port}`);
  });

  app.use("/", router);  

}).catch(err => {

  console.log(err);
  throw new Error(err);

});
