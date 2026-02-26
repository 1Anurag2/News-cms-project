const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/connectdb");
const recentNewsMiddleware = require("./middleware/recentnews");
const setPaginationDefaults = require("./middleware/setPaginationDefaults");
const path = require("path");
require("dotenv").config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressEjsLayouts);

app.set("layout", "layout");

// ================== VIEW ENGINE ==================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // IMPORTANT

// ================== GLOBAL MIDDLEWARE ==================
app.use(recentNewsMiddleware);
app.use(setPaginationDefaults);

// ================== DATABASE ==================
connectdb();

// ================== ROUTES ==================
app.use("/", require("./routes/frontend"));

app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});
app.use("/admin", require("./routes/admin"));

// ================== LOCAL SERVER ==================
const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

module.exports = app;