const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const createError = require("../utils/error-message");
const { validationResult } = require("express-validator");

const allCategories = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/categories", { categories, role: req.role });
};
const addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({errors:errors.array()})
    return res.render("admin/categories/create", {
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    await categoryModel.create(req.body);
    res.redirect("/admin/category");
  } catch (e) {
    // console.log(e);
    // res.status(500).send('Internal Server Error');
    next(e);
  }
};
const addCategoryPage = async (req, res, next) => {
  res.render("admin/categories/create", { role: req.role, errors: 0 });
};
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const category = await categoryModel.findById(id);
    // return res.status(400).json({errors:errors.array()})
    return res.render("admin/categories/update", {
      role: req.role,
      category,
      errors: errors.array(),
    });
  }
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      //   res.status(404).send("category not found");
      return next(createError("Category not found", 404));
    }
    category.name = req.body.name;
    category.description = req.body.description;
    await category.save();
    res.redirect("/admin/category");
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};
const updateCategoryPage = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  res.render("admin/categories/update", {
    category,
    role: req.role,
    errors: 0,
  });
};
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params; // get id from params
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    // Check if any article is associated with this category
    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).json({
        success: false,
        message: "Category is associated with an article",
      });
    }

    await category.deleteOne();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  allCategories,
  addCategory,
  addCategoryPage,
  updateCategory,
  updateCategoryPage,
  deleteCategory,
};
