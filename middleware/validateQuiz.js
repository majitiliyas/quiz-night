// Custom middleware: checks the form BEFORE we send a request to the API
const { renderHome } = require("../controllers/quizController");

const DIFFICULTIES = ["", "easy", "medium", "hard"];

function validateQuiz(req, res, next) {
  const player = (req.body.player || "").trim();
  const category = req.body.category || "";
  const difficulty = req.body.difficulty || "";
  const amount = Number(req.body.amount);
  const errors = [];

  if (player === "") {
    errors.push("Please enter your name.");
  } else if (player.length < 2 || player.length > 20) {
    errors.push("Name must be from 2 to 20 characters.");
  }

  if (category !== "" && !/^\d+$/.test(category)) {
    errors.push("Please choose a category from the list.");
  }

  if (!DIFFICULTIES.includes(difficulty)) {
    errors.push("Please choose a difficulty from the list.");
  }

  if (!Number.isInteger(amount) || amount < 1 || amount > 10) {
    errors.push("Number of questions must be a whole number from 1 to 10.");
  }

  if (errors.length > 0) {
    // show the form again with errors and with what the user typed
    return renderHome(res, errors, { player, category, difficulty, amount: req.body.amount }, 400);
  }

  next(); // everything is ok -> go to the controller
}

module.exports = validateQuiz;
