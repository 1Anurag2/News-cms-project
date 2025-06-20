const express = require('express');
const router = express.Router();    

const articleController = require('../controllers/articleController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');

 //Login Routes
router.get('/', userController.loginPage);
router.post('/index', userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard',userController.dashboard);
router.get('/setting',userController.setting);

//User crud routes
router.get('/users', userController.allUsers);
router.get('/add-users', userController.addUserPage);
router.post('/add-users', userController.addUser);
router.get('/update-users/:id', userController.updateUserPage);
router.post('/update-users/:id', userController.updateUser);
router.get('/delete-users/:id', userController.deleteUser);

//Category crud routes
router.get('/category', categoryController.allCategories);
router.get('/add-category', categoryController.addCategoryPage);
router.post('/add-category', categoryController.addCategory);
router.get('/update-category/:id', categoryController.updateCategoryPage);
router.post('/update-category/:id', categoryController.updateCategory);
router.get('/delete-category/:id', categoryController.deleteCategory);

//Article crud routes
router.get('/article', articleController.allArticles);
router.get('/add-article', articleController.addArticlePage);
router.post('/add-article', articleController.addArticle);
router.get('/update-article/:id', articleController.updateArticlePage);
router.post('/update-article/:id', articleController.updateArticle);
router.get('/delete-article/:id', articleController.deleteArticle);

//Comment  routes
router.get('/comments', commentController.allComments);


module.exports = router;