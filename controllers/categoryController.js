const categoryModel = require('../models/Category');

const allCategories = async (req, res) => {
    res.render('admin/categories', { role: req.role });
}
const addCategory = async (req, res) => {
    
}
const addCategoryPage = async (req, res) => {
    res.render('admin/categories/create', { role: req.role });
}
const updateCategory = async (req, res) => {}
const updateCategoryPage = async (req, res) => {
    res.render('admin/categories/update', { role: req.role });
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