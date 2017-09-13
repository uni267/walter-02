import request from "supertest";

import express from "express";

const app = express();

app.get("/test", (req, res) => {
  res.json({ success: true });
});

request(app).get("/test").end( (err, res) => console.log(res) );
