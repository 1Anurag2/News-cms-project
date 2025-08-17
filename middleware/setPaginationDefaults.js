// middlewares/paginationDefaults.js
module.exports = (req, res, next) => {
  res.locals.totalPages = res.locals.totalPages || 0;
  res.locals.currentPage = res.locals.currentPage || 1;
  res.locals.hasPrevPage = res.locals.hasPrevPage || false;
  res.locals.hasNextPage = res.locals.hasNextPage || false;
  res.locals.prevPage = res.locals.prevPage || null;
  res.locals.nextPage = res.locals.nextPage || null;
  res.locals.baseUrl = res.locals.baseUrl || ""; // optional
  next();
};
