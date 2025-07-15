const express = require("express");
const router = express.Router();

const siteController = require("../controllers/siteController");
const changeSite = require("../middleware/changeSite");

router.use(changeSite);

router.get("/", siteController.index);
// router.get("/recent", siteController.recentdata);
router.get("/category/:name", siteController.articleByCategory);
router.get("/single/:id", siteController.singleArticle);
router.get("/search", siteController.search);
router.get("/author/:id", siteController.author);
router.post("/single/:id/comment", siteController.addComment);

module.exports = router;