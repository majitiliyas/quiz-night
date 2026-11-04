// Controller: logic of every page (get data from the service -> render EJS)
const triviaService = require("../services/triviaService");
const quizStore = require("../models/quizStore");

// helper: renders the home page (also used by the validation middleware)
async function renderHome(res, errors, input, status) {
  let categories = [];
  let apiWarning = null;
  try {
    categories = await triviaService.getCategories();
  } catch (err) {
    // the page still works without categories ("Any category")
    console.error("Could not load categories:", err.message);
    apiWarning = "Categories could not be loaded right now, but you can still play with \"Any category\".";
  }
  res.status(status || 200).render("index", {
    title: "Home",
    categories: categories,
    errors: errors || [],
    input: input || { player: "", category: "", difficulty: "", amount: 5 },
    apiWarning: apiWarning,
  });
}

// GET /
async function showHome(req, res) {
  // ?category=18 comes from the "Play this category" button
  const input = { player: "", category: req.query.category || "", difficulty: "", amount: 5 };
  await renderHome(res, [], input);
}

// POST /quiz  (input is already checked by validateQuiz middleware)
async function startQuiz(req, res, next) {
  try {
    const { player, category, difficulty, amount } = req.body;
    const questions = await triviaService.getQuestions(Number(amount), category, difficulty);

    // "no results" state: the API has not enough questions for this choice
    if (questions.length === 0) {
      return renderHome(
        res,
        ["Sorry, there are not enough questions for these settings. Try fewer questions, another difficulty or another category."],
        req.body,
        404
      );
    }

    // save the quiz with correct answers on the server
    const quizId = quizStore.saveQuiz(player.trim(), questions);

    res.render("quiz", {
      title: "Quiz",
      quizId: quizId,
      player: player.trim(),
      questions: questions,
    });
  } catch (err) {
    next(err); // goes to errorHandler
  }
}

// POST /quiz/:id/check
function checkQuiz(req, res, next) {
  const quiz = quizStore.getQuiz(req.params.id);
  if (!quiz) {
    const err = new Error("This quiz was not found or is already finished. Start a new one!");
    err.status = 404;
    return next(err);
  }

  // compare every answer of the user with the correct answer
  const review = quiz.questions.map((q, index) => {
    const userAnswer = req.body["q" + index] || null; // radio buttons are named q0, q1, q2...
    return {
      question: q.question,
      difficulty: q.difficulty,
      correct: q.correct,
      userAnswer: userAnswer,
      isCorrect: userAnswer === q.correct,
    };
  });

  const score = review.filter((r) => r.isCorrect).length;
  const total = review.length;
  const percent = Math.round((score / total) * 100);

  quizStore.deleteQuiz(quiz.id); // one quiz can be checked only once

  res.render("result", {
    title: "Result",
    player: quiz.player,
    score: score,
    total: total,
    percent: percent,
    rank: getRank(percent),
    review: review,
  });
}

// GET /categories
async function showCategories(req, res, next) {
  try {
    const categories = await triviaService.getCategories();
    res.render("categories", { title: "Categories", categories: categories });
  } catch (err) {
    next(err);
  }
}

// GET /categories/:id
async function showCategoryDetails(req, res, next) {
  try {
    const id = Number(req.params.id);
    const categories = await triviaService.getCategories();
    const category = categories.find((c) => c.id === id);

    // unknown id -> 404 page
    if (!category) {
      const err = new Error("Category not found.");
      err.status = 404;
      return next(err);
    }

    const stats = await triviaService.getCategoryCount(id);
    res.render("category", { title: category.name, category: category, stats: stats });
  } catch (err) {
    next(err);
  }
}

// gives a funny title for the score
function getRank(percent) {
  if (percent === 100) return { name: "Trivia Legend", emoji: "🏆" };
  if (percent >= 70) return { name: "Big Brain", emoji: "🧠" };
  if (percent >= 40) return { name: "Not Bad At All", emoji: "😎" };
  return { name: "Keep Practicing", emoji: "📚" };
}

module.exports = { renderHome, showHome, startQuiz, checkQuiz, showCategories, showCategoryDetails };
