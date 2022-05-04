import express from "express";
import nunjucks from "nunjucks";
import markdown from "nunjucks-markdown";
import { marked } from "marked";
import { getPublicInformation, gallery, getBlogPosts, getBlogPost } from "./api.mjs";

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
app.use(
  "/gallery",
  aw(async (req, res, next) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    res.render("gallery.html", {
      page: await gallery(page, pageSize),
      pageTitle: WEBSITE_TITLE,
      activePage: 'gallery'
    });
  })
);
// ROUTES
app.use(
  "/blog/posts/:postId/:slug",
  aw(async (req, res, next) => {
    const id = req.params.postId;
    const slug = req.params.slug;
    res.render("post.html", {
      post: await getBlogPost(id, slug),
      pageTitle: WEBSITE_TITLE,
      activePage: 'blog'
    });
  })
);
app.use(
  "/blog",
  aw(async (req, res, next) => {
    const page = parseInt(req.query.page) || undefined;
    const pageSize = parseInt(req.query.pageSize) || undefined;
    res.render("blog.html", {
      posts: await getBlogPosts({}, page, pageSize),
      pageTitle: WEBSITE_TITLE,
      activePage: 'blog'
    });
  })
);

app.use(
  "/",
  aw(async (req, res, next) => {
    res.render("index.html", {
      publicInfo: await getPublicInformation(),
      pageTitle: WEBSITE_TITLE,
      activePage: 'home'
    });
  })
);

// ERROR

app.use((err, req, res, next) => {
  res.status(500);
  console.error(err.stack);
  res.render("error.html", { error: err });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));

function configureNunjucks(app) {
  const nunjucksEnv = nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  nunjucksEnv.addFilter("json", function (value, spaces) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, spaces).replace(
      /</g,
      "\\u003c"
    );
    return nunjucks.runtime.markSafe(jsonString);
  });
  nunjucksEnv.addFilter("slug", function (value, spaces) {
    const slugify = (input) => {
      return input
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    };
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const slug = slugify(value);
    return nunjucks.runtime.markSafe(slug);
  });

  nunjucksEnv.addFilter("date", function (value, spaces) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const dateValue = new Date(value);
    return nunjucks.runtime.markSafe(dateValue.toLocaleDateString("fr"));
  });
  markdown.register(nunjucksEnv, marked);
}
