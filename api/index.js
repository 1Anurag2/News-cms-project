const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectdb = require("../config/connectdb");
const recentNewsMiddleware = require("../middleware/recentnews");
const setPaginationDefaults = require("../middleware/setPaginationDefaults");
const path = require("path");
require("dotenv").config();

const serverless = require("serverless-http");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(expressEjsLayouts);
app.set("layout", "layout");

app.use(recentNewsMiddleware);
app.use(setPaginationDefaults);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// database
connectdb();

// routes
app.use("/", require("../routes/frontend"));

app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});
app.use("/admin", require("../routes/admin"));

module.exports = app;
module.exports.handler = serverless(app);