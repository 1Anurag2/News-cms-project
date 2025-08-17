// middleware/recentNews.js
const newsModel = require("../models/News"); 

const recentNewsMiddleware = async (req, res, next) => {
  try {
    const recentnews = await newsModel
      .find()
      .populate("category", { name: 1, slug: 1 })
      .populate("author", "fullname")
      .sort({ createdAt: -1 })
      .limit(4);

    res.locals.recentnews = recentnews;
    next();
  } catch (error) {
    console.error("Error loading recent news:", error);
    next(); // continue to next middleware even if failed
  }
};

module.exports = recentNewsMiddleware;
