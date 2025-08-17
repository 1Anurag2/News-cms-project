// helpers/paginate.js
const striptags = require('striptags');
const newsModel = require('../models/News'); // adjust path if needed

async function paginateNews(query, page, limit, baseUrl) {
  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: "category", select: "name slug" },
      { path: "author", select: "fullname" }
    ],
    lean: true
  };

  const result = await newsModel.paginate(query, options);

  // Add summary to each
  const newsWithSummary = result.docs.map(item => {
    const plainText = striptags(item.content);
    item.summary = plainText.substring(0, 100) + "...";
    return item;
  });

  return {
    news: newsWithSummary,
    pagination: {
      totalPages: result.totalPages,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      baseUrl
    }
  };
}

module.exports = paginateNews;
