const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/connectdb");
const recentNewsMiddleware = require('./middleware/recentnews');
const setPaginationDefaults = require('./middleware/setPaginationDefaults');
const path = require("path");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressEjsLayouts);
app.set("layout", "layout");

// Use the recent news middleware globally
app.use(recentNewsMiddleware);
app.use(setPaginationDefaults);


//view Engine
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

//Database Connection
connectdb();

//Routes
app.use("/", require("./routes/frontend"));

app.use("/admin", (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
});
app.use("/admin", require("./routes/admin"));

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

module.exports = app;