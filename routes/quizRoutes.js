// Routes: which URL calls which controller function
const express = require("express");
const quizController = require("../controllers/quizController");
const validateQuiz = require("../middleware/validateQuiz");

const router = express.Router();

router.get("/", quizController.showHome);                       // home page with the form
router.post("/quiz", validateQuiz, quizController.startQuiz);   // form -> API -> quiz page
router.post("/quiz/:id/check", quizController.checkQuiz);       // check answers -> result page
router.get("/categories", quizController.showCategories);       // list of all categories
router.get("/categories/:id", quizController.showCategoryDetails); // details of one category

module.exports = router;
