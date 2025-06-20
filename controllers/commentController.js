const commentModel = require("../models/Comment");

const allComments = async (req, res) => {
    res.render('admin/comments')
};

module.exports = {
    allComments,
};