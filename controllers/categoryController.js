const categoryModel = require('../models/Category');

const allCategories = async (req, res) => {
    res.render('admin/categories')
}
const addCategory = async (req, res) => {
    
}
const addCategoryPage = async (req, res) => {
    res.render('admin/categories/create')
}
const updateCategory = async (req, res) => {}
const updateCategoryPage = async (req, res) => {
    res.render('admin/categories/update')
}
const deleteCategory = async (req, res) => {}

module.exports = {
    allCategories,
    addCategory,
    addCategoryPage,
    updateCategory,
    updateCategoryPage,
    deleteCategory
}