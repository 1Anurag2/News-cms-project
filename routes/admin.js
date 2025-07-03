const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const isLoggedin = require("../middleware/isLoggedin");
const isAdmin = require("../middleware/isAdmin");
const isValid = require("../middleware/validation");
const upload = require("../middleware/multer");

//Login Routes
router.get("/", userController.loginPage);
router.post("/index", isValid.loginValidation, userController.adminLogin);
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
router.post("/add-users", isLoggedin,isValid.userValidation, isAdmin, userController.addUser);
router.get(
  "/update-users/:id",
  isLoggedin,
  isAdmin,
  userController.updateUserPage
);
router.post(
  "/update-users/:id",
  isLoggedin,
  isValid.userUpdateValidation,
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
  isValid.categoryValidation,
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
  isValid.categoryValidation,
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
  isValid.articalValidation,
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
  isValid.articalValidation,
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
    message: " Page Not Found",
  });
});

// 500 Error Handler
router.use(isLoggedin, (err, req, res, next) => {
  console.log(err.stack);
  const status = err.status || 500; // you forgot to define `status`
  // const view = status === 404 ? 'admin/404' : 'admin/500';
  let view;
  switch (status) {
    case 401:
      view = "admin/401";
      break;
    case 404:
      view = "admin/404";
      break;
    case 500:
      view = "admin/500";
      break;
    default:
      view = "admin/500";
  }
  res.status(status).render(view, {
    role: req.role,
    message: err.message || "Something went wrong",
  });
});

module.exports = router;
