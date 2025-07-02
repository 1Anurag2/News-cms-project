const mongoose = require('mongoose');

const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');
const createError = require('../utils/error-message');



const index = async (req, res) => {
   const article = await newsModel.find().populate('category', 'name').populate('author', 'fullname');
   res.render('index',{article}); 
}   
const articleByCategory = async (req, res) => {
    res.render('category')
}
const singleArticle = async (req, res, next) => {
    try {
        const id = req.params.id;
        const singleArticle = await newsModel.findById(id).populate('category', 'name').populate('author', 'fullname');
        res.render('single', {singleArticle});
    } catch (error) {
        // console.log(error);
        // res.status(500).send("Internal Server Error");
        next(error);
    }
}
const search = async (req, res) => {
    res.render('search')
}
const author = async (req, res) => {
    res.render('author')
}
const addComment = async (req, res) => {}

module.exports = {
    index,
    articleByCategory,
    singleArticle,
    search,
    author,
    addComment
}