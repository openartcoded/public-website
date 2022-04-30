import express from "express";
import nunjucks from "nunjucks";
import { getPublicInformation, gallery } from "./api.mjs";

const SERVER_PORT = process.env.SERVER_PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const WEBSITE_TITLE = process.env.WEBSITE_TITLE || "Nordine Bittich";

const app = express();

// CONFIG
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const nunjucksEnv = nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

nunjucksEnv.addFilter('json', function (value, spaces) {
  if (value instanceof nunjucks.runtime.SafeString) {
    value = value.toString()
  }
  const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
  return nunjucks.runtime.markSafe(jsonString)
});

nunjucksEnv.addFilter('date', function (value, spaces) {
  if (value instanceof nunjucks.runtime.SafeString) {
    value = value.toString()
  }
  const dateValue = new Date(value);
  return nunjucks.runtime.markSafe(dateValue.toLocaleDateString("fr"));
});

// STATIC
app.use(express.static("public/favicon"));
app.use(express.static("public/img"));
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/manifest"));

const aw = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
};

// ROUTES
app.use(
  "/gallery",
  aw(async (req, res, next) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    res.render("gallery.html", { page: await gallery(page, pageSize ), pageTitle: WEBSITE_TITLE });
  })
);

app.use(
  "/",
  aw(async (req, res, next) => {
    res.render("index.html", { publicInfo: await getPublicInformation(), pageTitle: WEBSITE_TITLE });
  })
);

// ERROR

app.use((err, req, res, next) => {
  res.status(500);
  console.error(err.stack);
  res.render("error.html", { error: err });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));
