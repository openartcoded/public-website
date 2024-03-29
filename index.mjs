import express from "express";
import apicache from "apicache";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import { configureNunjucks } from "./init.mjs";
import {
  getPublicInformation,
  gallery,
  getBlogPosts,
  postSparqlQuery,
  getBlogPost,
  postContactForm,
  download,
  CHECK_OPERATIONS,
} from "./api.mjs";

const SERVER_PORT = process.env.SERVER_PORT || 4000;
const SPARQL_DEFAULT_QUERY =
  process.env.SPARQL_DEFAULT_QUERY ||
  `  
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cv: <http://rdfs.org/resume-rdf/cv.rdfs#>
PREFIX baseCv: <http://rdfs.org/resume-rdf/base.rdfs#>

CONSTRUCT {?s ?p ?o}
WHERE {
  graph <https://bittich.be/graphs/public>{
    ?s ?p ?o
  }
}
`;

const WEBSITE_TITLE = process.env.WEBSITE_TITLE || "Nordine Bittich";
const SESSION_KEY =
  process.env.SESSION_KEY ||
  "$$secret_" + (new Date().getTime() + Math.random() + crypto.randomUUID());
const app = express();
const router = express.Router();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// CONFIG
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const ONE_DAY = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: SESSION_KEY,
    saveUninitialized: false,
    cookie: { maxAge: ONE_DAY, sameSite: "strict" },
    resave: false,
  }),
);

app.use(cookieParser());

configureNunjucks(app);

// STATIC
app.use(express.static("public/favicon"));
app.use(express.static("public/img"));
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/manifest"));

const aw = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
};

// CACHE
const cache = apicache.middleware;
const onlyStatus200 = (_req, res) => res.statusCode === 200;
const cacheSuccesses = cache("5 minutes", onlyStatus200);

// ROUTES
router.get(
  "/resource/:id",
  aw(async (req, res, _next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const resp = await download(req.params.id, ip);
    const headers = Array.from(resp.headers)
      .filter(([key]) => !key.includes("content-encoding"))
      .reduce((headers, [key, value]) => ({ [key]: value, ...headers }), {});
    res.set(headers);

    res.status(200).send(Buffer.from(await resp.arrayBuffer()));
  }),
);
router.get(
  "/sparql-form",
  aw(async (_req, res, _next) => {
    res.render("sparql.html", {
      pageTitle: WEBSITE_TITLE,
      activePage: "sparql-form",
      defaultQuery: SPARQL_DEFAULT_QUERY,
      defaultAcceptType: "application/trig",
    });
  }),
);
router.post(
  "/sparql-form",
  aw(async (req, res, _next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const result = await postSparqlQuery(req.body, ip);

    res.render("sparql.html", {
      pageTitle: WEBSITE_TITLE,
      result,
      activePage: "sparql-form",
      defaultQuery: req.body.sparqlQuery,
      defaultAcceptType: req.body.acceptType,
    });
  }),
);
router.get(
  "/contact",
  aw(async (req, res, _next) => {
    const message = req.query.message;
    let num1 = getRndInteger(0, 10);
    let num2 = getRndInteger(0, 10);
    const randomOperation =
      CHECK_OPERATIONS[getRndInteger(0, CHECK_OPERATIONS.length)];
    if (randomOperation === "-" && num1 < num2) {
      let temp = num2;
      num2 = num1;
      num1 = temp;
    }
    req.session.num1 = num1;
    req.session.num2 = num2;
    req.session.randomOperation = randomOperation;
    res.render("contact.html", {
      pageTitle: WEBSITE_TITLE,
      activePage: "contact",
      message,
      num1,
      num2,
      randomOperation,
    });
  }),
);
router.post(
  "/contact",
  aw(async (req, res, _next) => {
    if (req.session?.mailSent) {
      res.redirect("/contact?message=" + "mail already sent. please wait 24h");
    } else {
      if (!req.body.gdprConsent) {
        res.redirect(
          "/contact?message=" + "Request discarded. Consent not provided",
        );
        return;
      }
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip;
      const { message, valid } = await postContactForm(
        req.body,
        req.session.num1,
        req.session.num2,
        req.session.randomOperation,
        ip,
      );
      req.session.num1 = null;
      req.session.num2 = null;
      req.session.randomOperation = null;

      req.session.mailSent = valid;

      res.redirect("/contact?message=" + message);
    }
  }),
);
router.get(
  "/gallery",
  cacheSuccesses,
  aw(async (req, res) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    res.render("gallery.html", {
      page: await gallery(page, pageSize, ip),
      pageTitle: WEBSITE_TITLE,
      activePage: "gallery",
    });
  }),
);
// ROUTES
router.get(
  "/blog/posts/:postId/:slug",
  cacheSuccesses,
  aw(async (req, res) => {
    const id = req.params.postId;
    const slug = req.params.slug;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    res.render("post.html", {
      post: await getBlogPost(id, slug, ip),
      pageTitle: WEBSITE_TITLE,
      activePage: "blog",
    });
  }),
);
router.get(
  "/blog",
  cacheSuccesses,
  aw(async (req, res) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    res.render("blog.html", {
      posts: await getBlogPosts({}, page, pageSize, ip),
      pageTitle: WEBSITE_TITLE,
      activePage: "blog",
    });
  }),
);

router.get(
  "/",
  cacheSuccesses,
  aw(async (req, res) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    res.render("index.html", {
      publicInfo: await getPublicInformation(ip),
      pageTitle: WEBSITE_TITLE,
      activePage: "",
    });
  }),
);

app.use("/", router);
// ERROR

app.use((err, _req, res, _next) => {
  res.status(500);
  console.error(err.stack);
  res.render("error.html", { error: err });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));
