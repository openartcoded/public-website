import express from "express";
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
  process.env.SESSION_KEY || "thisismysecrctekeyfhrgfgrfrty84fwir767";

const app = express();
const router = express.Router();

// CONFIG
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: SESSION_KEY,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
  })
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

// ROUTES
router.get(
  "/resource/:id",
  aw(async (req, res, _next) => {
    const resp = await download(req.params.id);
    const headers = Array.from(resp.headers)
      .filter(([key]) => !key.includes("content-encoding"))
      .reduce((headers, [key, value]) => ({ [key]: value, ...headers }), {});
    res.set(headers);

    res.status(200).send(Buffer.from(await resp.arrayBuffer()));
  })
);
router.get(
  "/sparql-form",
  aw(async (req, res, _next) => {
    res.render("sparql.html", {
      pageTitle: WEBSITE_TITLE,
      activePage: "sparql-form",
      defaultQuery: SPARQL_DEFAULT_QUERY,
      defaultAcceptType: "application/trig",
    });
  })
);
router.post(
  "/sparql-form",
  aw(async (req, res, _next) => {
    const result = await postSparqlQuery(req.body);

    res.render("sparql.html", {
      pageTitle: WEBSITE_TITLE,
      result,
      activePage: "sparql-form",
      defaultQuery: req.body.sparqlQuery,
      defaultAcceptType: req.body.acceptType,
    });
  })
);
router.get(
  "/contact",
  aw(async (req, res, _next) => {
    const message = req.query.message;
    res.render("contact.html", {
      pageTitle: WEBSITE_TITLE,
      activePage: "contact",
      message,
    });
  })
);
router.post(
  "/contact",
  aw(async (req, res, _next) => {
    if (req.session?.mailSent) {
      res.redirect("/contact?message=" + "mail already sent");
    } else {
      const message = await postContactForm(req.body);
      req.session.mailSent = true;

      res.redirect("/contact?message=" + message);
    }
  })
);
router.get(
  "/gallery",
  aw(async (req, res, _next) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    res.render("gallery.html", {
      page: await gallery(page, pageSize),
      pageTitle: WEBSITE_TITLE,
      activePage: "gallery",
    });
  })
);
// ROUTES
router.get(
  "/blog/posts/:postId/:slug",
  aw(async (req, res, _next) => {
    const id = req.params.postId;
    const slug = req.params.slug;
    res.render("post.html", {
      post: await getBlogPost(id, slug),
      pageTitle: WEBSITE_TITLE,
      activePage: "blog",
    });
  })
);
router.get(
  "/blog",
  aw(async (req, res, _next) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    res.render("blog.html", {
      posts: await getBlogPosts({}, page, pageSize),
      pageTitle: WEBSITE_TITLE,
      activePage: "blog",
    });
  })
);

router.get(
  "/",
  aw(async (_req, res, _next) => {
    res.render("index.html", {
      publicInfo: await getPublicInformation(),
      pageTitle: WEBSITE_TITLE,
      activePage: "",
    });
  })
);

app.use("/", router);
// ERROR

app.use((err, _req, res, _next) => {
  res.status(500);
  console.error(err.stack);
  res.render("error.html", { error: err });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));


