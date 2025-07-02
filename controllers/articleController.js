const articleModel = require("../models/Category");
const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const userModel = require("../models/User");
const fs = require("fs");
const path = require("path");
const createError = require('../utils/error-message');

const allArticles = async (req, res, next) => {
  try {
    if (req.role == "Admin") {
      const articles = await newsModel
        .find()
        .populate("category", "name")
        .populate("author", "fullname");
      res.render("admin/articles", { articles, role: req.role });
    } else {
      const articles = await newsModel
        .find({ author: req.id })
        .populate("category", "name")
        .populate("author", "fullname");
      // res.json(articles)
      res.render("admin/articles", { articles, role: req.role });
    }
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};
const addArticlePage = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/articles/create", { role: req.role, categories });
};
const addArticle = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename,
    });

    await article.save();
    res.redirect("/admin/articles");
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};
const updateArticlePage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await newsModel
      .findById(id)
      .populate("category", "name")
      .populate("author", "fullname");
    // res.json(article)
    if (!article) {
      // res.status(404).send("article not found");.
      // const error = new Error("Article not found");
      // error.status = 404;
      // return next(error);
      return next(createError('Article not found',404));
    }
    if (req.role == "Author") {
      if (req.id != article.author._id) {
        res.status(401).send("Unauthorized");
      }
    }
    const categories = await categoryModel.find();
    res.render("admin/articles/update", {
      article,
      categories,
      role: req.role,
    });
  } catch (error) {
    // console.log(error);
    // res.status(500).send("Internal Server Error");
    next(error);
  }
};
const updateArticle = async (req, res , next) => {
  try {
    const id = req.params.id;
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      // res.status(404).send("article not found");
      return next(createError('Article not found',404));
    }
    if (req.role == "Author") {
      if (req.id != article.author._id) {
        res.status(401).send("Unauthorized");
      }
    }
    article.title = title;
    article.content = content;
    article.category = category;
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        article.image
      );
      fs.unlinkSync(imagePath);
      article.image = req.file.filename;
    }
    await article.save();
    res.redirect("/admin/articles");
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};
const deleteArticle = async (req, res , next) => {
  try {
    const news = await newsModel.findById(req.params.id);
    if (!news) {
      // return res.status(404).send("Article not found");
      return next(createError('Article not found',404));
    }

    if (req.role == "Author") {
      if (req.id != article.author._id) {
        return res.status(401).send("Unauthorized");
      }
    }
    //delete image
    try {
      const imagePath = path.join(__dirname, "../public/uploads", news.image);
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error("Error deleting image:", error);
    }

    await news.deleteOne();
    res.json({ success: true });
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};

module.exports = {
  allArticles,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle,
};
