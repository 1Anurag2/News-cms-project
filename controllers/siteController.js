const mongoose = require("mongoose");
const paginateNews = require("../utils/paginate");

const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");
const settingModel = require("../models/siteChange");
const createError = require("../utils/error-message");
const paginate = require("../utils/paginate");
const striptags = require("striptags");

// const index = async (req, res) => {
//   const news = await newsModel
//     .find()
//     .populate("category", { name: 1, slug: 1 })
//     .populate("author", "fullname")
//     .sort({ createdAt: -1 });

//   // Create a new array with summary field
//   const newsWithSummary = news.map((item) => {
//     // Convert mongoose document to plain object
//     const plainItem = item.toObject();

//     // Strip HTML tags
//     const plainText = striptags(plainItem.content);

//     // Add summary field (first 100 chars)
//     plainItem.summary = plainText.substring(0, 100) + "...";

//     return plainItem;
//   });

//   const categoriesInUse = await newsModel.distinct("category");
//   const categories = await categoryModel.find({
//     _id: { $in: categoriesInUse },
//   });

//   res.render("index", { news: newsWithSummary, categories });
// };

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 4;

    const { news, pagination } = await paginateNews({}, page, limit, "/");

    const categoriesInUse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoriesInUse },
    });

    // Pass pagination to res.locals
    Object.assign(res.locals, pagination);

    res.render("index", { news, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const articleByCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.name });
    if (!category) {
      return res.status(404).send("Category not found..");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const { news, pagination } = await paginateNews(
      { category: category._id },
      page,
      limit,
      `/category/${req.params.name}`
    );

    const categoriesInUse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoriesInUse },
    });

    Object.assign(res.locals, pagination);

    res.render("index", { news, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const singleArticle = async (req, res, next) => {
  try {
    const singlenews = await newsModel
      .findById(req.params.id)
      .populate("category", { name: 1, slug: 1 })
      .populate("author", "fullname")
      .sort({ createdAt: -1 });
    const categoriesInUse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoriesInUse },
    });

    //Get all comments for this article
    const comments = await commentModel
      .find({ article: req.params.id, status: "approved" })
      .sort({ createdAt: -1 });

    // res.json(comments)
    res.render("single", { singlenews, categories, comments });
  } catch (error) {
    // console.log(error);
    // res.status(500).send("Internal Server Error");
    next(error);
  }
};

const search = async (req, res) => {
  const searchQuery = req.query.search;
  const news = await newsModel
    .find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });
  const categoriesInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({
    _id: { $in: categoriesInUse },
  });
  res.render("search", { news, categories, searchQuery });
};

const author = async (req, res) => {
  try {
    const user = await require("../models/userModel").findOne({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(404).send("Author not found");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const { news, pagination } = await paginateNews(
      { author: req.params.id },
      page,
      limit,
      `/author/${req.params.id}`
    );

    const categoriesInUse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoriesInUse },
    });

    Object.assign(res.locals, pagination);

    res.render("index", { news, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const addComment = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    const articleId = req.params.id;

    // Validate input
    if (!name || !email || !content) {
      return res.status(400).send("All fields are required.");
    }

    // Create new comment
    const newComment = new commentModel({
      article: articleId,
      name,
      email,
      content,
      // status: 'pending' // Default status
    });

    await newComment.save();

    // Redirect back to the single article page
    res.redirect(`/single/${articleId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  index,
  articleByCategory,
  singleArticle,
  search,
  author,
  addComment,
};
