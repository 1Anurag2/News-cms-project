const express = require('express');
const router = express.Router();    

const articleController = require('../controllers/articleController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const isLoggedin = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');

 //Login Routes
router.get('/', userController.loginPage);
router.post('/index', userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard',isLoggedin,userController.dashboard);
router.get('/setting',isLoggedin,isAdmin,userController.setting);

//User crud routes
router.get('/users', isLoggedin,isAdmin,userController.allUsers);
router.get('/add-users',isLoggedin, isAdmin,userController.addUserPage);
router.post('/add-users', isLoggedin,isAdmin,userController.addUser);
router.get('/update-users/:id', isLoggedin,isAdmin,userController.updateUserPage);
router.post('/update-users/:id', isLoggedin,isAdmin,userController.updateUser);
router.delete('/delete-users/:id', isLoggedin,isAdmin,userController.deleteUser);

//Category crud routes
router.get('/category',isLoggedin, isAdmin,categoryController.allCategories);
router.get('/add-category',isLoggedin, isAdmin,categoryController.addCategoryPage);
router.post('/add-category',isLoggedin, isAdmin,categoryController.addCategory);
router.get('/update-category/:id',isLoggedin, isAdmin,categoryController.updateCategoryPage);
router.post('/update-category/:id',isLoggedin, isAdmin,categoryController.updateCategory);
router.get('/delete-category/:id', isLoggedin,isAdmin,categoryController.deleteCategory);

//Article crud routes
router.get('/article',isLoggedin, articleController.allArticles);
router.get('/add-article', isLoggedin,articleController.addArticlePage);
router.post('/add-article',isLoggedin, articleController.addArticle);
router.get('/update-article/:id',isLoggedin, articleController.updateArticlePage);
router.post('/update-article/:id',isLoggedin, articleController.updateArticle);
router.get('/delete-article/:id',isLoggedin, articleController.deleteArticle);

//Comment  routes
router.get('/comments',isLoggedin, commentController.allComments);


module.exports = router;