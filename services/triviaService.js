// Service: all Axios requests to the Open Trivia DB API are here
// Docs: https://opentdb.com/api_config.php
const axios = require("axios");

const BASE_URL = process.env.TRIVIA_API_URL || "https://opentdb.com";
const TIMEOUT = 5000; // if the API does not answer in 5 seconds -> error

// categories almost never change, so we save them after the first request
// (the API allows only 1 request per 5 seconds from one IP)
let cachedCategories = null;

// Request 1: list of categories
async function getCategories() {
  if (cachedCategories) {
    return cachedCategories;
  }
  const response = await axios.get(`${BASE_URL}/api_category.php`, { timeout: TIMEOUT });

  // sort categories by name (A-Z) and remove the "Entertainment: " part to make names shorter
  cachedCategories = response.data.trivia_categories
    .map((cat) => ({ id: cat.id, name: cat.name.replace("Entertainment: ", "").replace("Science: ", "") }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return cachedCategories;
}

// Request 2: questions (uses the user input from the form)
async function getQuestions(amount, category, difficulty) {
  // url3986 encoding: the API sends text like "What%20is" and we decode it ourselves
  const params = { amount: amount, type: "multiple", encode: "url3986" };
  if (category) params.category = category;
  if (difficulty) params.difficulty = difficulty;

  let response = await axios.get(`${BASE_URL}/api.php`, { params: params, timeout: TIMEOUT });

  // response_code 5 = rate limit (1 request per 5 seconds) -> wait 5 seconds and try ONE more time
  if (response.data.response_code === 5) {
    console.log("Rate limit from the API, waiting 5 seconds and trying again...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    response = await axios.get(`${BASE_URL}/api.php`, { params: params, timeout: TIMEOUT });
  }

  // not enough questions -> empty array, the controller shows a "no results" message
  if (response.data.response_code === 1) {
    return [];
  }
  checkResponseCode(response.data.response_code);

  // make the data nice for our EJS page
  return response.data.results.map((q) => {
    const correct = decodeURIComponent(q.correct_answer);
    const wrong = q.incorrect_answers.map((a) => decodeURIComponent(a));
    return {
      question: decodeURIComponent(q.question),
      category: decodeURIComponent(q.category),
      difficulty: q.difficulty,
      correct: correct,
      answers: shuffle([correct, ...wrong]), // mix answers so the correct one is not always first
    };
  });
}

// Request 3: how many questions a category has (by difficulty)
async function getCategoryCount(categoryId) {
  const response = await axios.get(`${BASE_URL}/api_count.php`, {
    params: { category: categoryId },
    timeout: TIMEOUT,
  });
  const c = response.data.category_question_count;

  // calculate percentages for the bars on the details page
  const total = c.total_question_count;
  const levels = [
    { name: "easy", count: c.total_easy_question_count },
    { name: "medium", count: c.total_medium_question_count },
    { name: "hard", count: c.total_hard_question_count },
  ].map((level) => ({ ...level, percent: total > 0 ? Math.round((level.count / total) * 100) : 0 }));

  return { total: total, levels: levels };
}

// Open Trivia DB returns its own "response_code" inside the JSON
function checkResponseCode(code) {
  if (code === 0) return;          // success
  if (code === 5) {                // rate limit
    const err = new Error("Too many requests. Please wait 5 seconds and try again.");
    err.status = 429;
    throw err;
  }
  const err = new Error("The trivia API returned an invalid answer.");
  err.status = 502;
  throw err;
}

// Fisher-Yates shuffle
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

module.exports = { getCategories, getQuestions, getCategoryCount };
