const categoryModel = require('../models/Category');
const createError = require('../utils/error-message')


const allCategories = async (req, res) => {
    const categories = await categoryModel.find();
    res.render('admin/categories', { categories,role: req.role });
}
const addCategory = async (req, res, next) => {
    try{
        await categoryModel.create(req.body);
        res.redirect('/admin/category');
    }
    catch(e){
        // console.log(e);
        // res.status(500).send('Internal Server Error');
        next(e);
    }
}
const addCategoryPage = async (req, res, next) => { 
    res.render('admin/categories/create', { role: req.role });
}
const updateCategory = async (req, res) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body);
        if (!category) {
        //   res.status(404).send("category not found");
            return next(createError('Category not found',404));
        } else {
          res.redirect('/admin/category');
        }
    } catch (e) {
        // console.log(e);
        // res.status(500).send("Internal Server Error");
        next(e);
    }
}
const updateCategoryPage = async (req, res) => {
    const category = await categoryModel.findById(req.params.id);
    res.render('admin/categories/update', {category, role: req.role });
}
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
        //   res.status(404).send("category not found");
            return next(createError('Category not found',404));
        }
        res.json({ success: true });
      } catch (e) {
        // console.log(e);
        // res.status(500).send("Internal Server Error");
        next(e);
      }
}

module.exports = {
    allCategories,
    addCategory,
    addCategoryPage,
    updateCategory,
    updateCategoryPage,
    deleteCategory
}