const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const isLoggedin = require("../middleware/isLoggedin");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");

//Login Routes
router.get("/", userController.loginPage);
router.post("/index", userController.adminLogin);
router.get("/logout", userController.logout);
router.get("/dashboard", isLoggedin, userController.dashboard);
router.get("/setting", isLoggedin, isAdmin, userController.setting);
router.post(
  "/save_setting",
  isLoggedin,
  isAdmin,
  upload.single("website_logo"),
  userController.save_setting
);

//User crud routes
router.get("/users", isLoggedin, isAdmin, userController.allUsers);
router.get("/add-users", isLoggedin, isAdmin, userController.addUserPage);
router.post("/add-users", isLoggedin, isAdmin, userController.addUser);
router.get(
  "/update-users/:id",
  isLoggedin,
  isAdmin,
  userController.updateUserPage
);
router.post(
  "/update-users/:id",
  isLoggedin,
  isAdmin,
  userController.updateUser
);
router.delete(
  "/delete-users/:id",
  isLoggedin,
  isAdmin,
  userController.deleteUser
);

//Category crud routes
router.get("/category", isLoggedin, isAdmin, categoryController.allCategories);
router.get(
  "/add-category",
  isLoggedin,
  isAdmin,
  categoryController.addCategoryPage
);
router.post(
  "/add-category",
  isLoggedin,
  isAdmin,
  categoryController.addCategory
);
router.get(
  "/update-category/:id",
  isLoggedin,
  isAdmin,
  categoryController.updateCategoryPage
);
router.post(
  "/update-category/:id",
  isLoggedin,
  isAdmin,
  categoryController.updateCategory
);
router.delete(
  "/delete-category/:id",
  isLoggedin,
  isAdmin,
  categoryController.deleteCategory
);

//Article crud routes
router.get("/articles", isLoggedin, articleController.allArticles);
router.get("/add-articles", isLoggedin, articleController.addArticlePage);
router.post(
  "/add-articles",
  isLoggedin,
  upload.single("image"),
  articleController.addArticle
);
router.get(
  "/update-articles/:id",
  isLoggedin,
  articleController.updateArticlePage
);
router.post(
  "/update-articles/:id",
  isLoggedin,
  upload.single("image"),
  articleController.updateArticle
);
router.delete(
  "/delete-articles/:id",
  isLoggedin,
  articleController.deleteArticle
);

//Comment  routes
router.get("/comments", isLoggedin, commentController.allComments);

// 404 Middleware
router.use(isLoggedin, (req, res, next) => {
  res.status(404).render("admin/404", {
    role: req.role,
    message: "404 Page Not Found",
  });
});

// 500 Error Handler
router.use(isLoggedin, (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).render("admin/500", {
    role: req.role,
    message: err.message || "Internal Server Error  ",
  });
});

module.exports = router;
