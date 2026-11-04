// Model: keeps quizzes in memory (like a tiny database)
// We save the correct answers on the server, so the user can not see them in the HTML
const quizzes = {};
let nextId = 1;

function saveQuiz(player, questions) {
  const id = nextId++;
  quizzes[id] = { id: id, player: player, questions: questions };
  return id;
}

function getQuiz(id) {
  return quizzes[id];
}

function deleteQuiz(id) {
  delete quizzes[id];
}

module.exports = { saveQuiz, getQuiz, deleteQuiz };
