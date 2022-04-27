const SERVER_PORT = process.env.SERVER_PORT || 4000;
const NODE_ENV = process.env.ENV || "development";

const express = require("express");
const nunjucks = require("nunjucks");

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

// ROUTES
app.use("/", (req, res) => {
  res.render("index.html", { message: "hello world" });
});

app.listen(SERVER_PORT, () => console.log(`Listen to ${SERVER_PORT}`));
