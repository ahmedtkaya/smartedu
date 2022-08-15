const pageControllers = require("../controllers/pageControllers");
const express = require("express");

const router = express.Router();

router.route("/").get(pageControllers.getIndexPage);
router.route("/about").get(pageControllers.getAboutPage);

module.exports = router;
