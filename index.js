const SERVER_PORT = process.env.SERVER_PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

import express from "express";
import nunjucks from "nunjucks";
import { getPublicInformation } from "./api.js";

const app = express();

// CONFIG
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// STATIC
app.use(express.static("public/favicon"));
app.use(express.static("public/img"));
app.use(express.static("public/css"));
app.use(express.static("public/manifest"));

const aw = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
};

// ROUTES
app.use(
  "/",
  aw(async (req, res, next) => {
    res.render("index.html", { publicInfo: await getPublicInformation() });
  })
);

// ERROR

app.use((err, req, res, next) => {
  res.status(500);
  console.error(err.stack);
  res.render("error.html", { error: err });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));
