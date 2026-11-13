// Centralized error handler: it has 4 parameters (err, req, res, next)
// Technical details -> console, friendly message -> user
function errorHandler(err, req, res, next) {
  console.error("ERROR:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || 500;
  let message = err.message;

  if (err.code === "ECONNABORTED") {
    // Axios timeout
    status = 504;
    message = "The trivia server is too slow right now. Please try again in a moment.";
  } else if (err.isAxiosError && err.response) {
    // the API answered with 4xx / 5xx
    status = err.response.status === 429 ? 429 : 502;
    message = status === 429
      ? "Too many requests. Please wait 5 seconds and try again."
      : "The trivia server returned an error. Please try again later.";
  } else if (err.isAxiosError) {
    // no answer at all (no internet, DNS problem...)
    status = 503;
    message = "Can not connect to the trivia server. Check your internet connection.";
  } else if (status === 500) {
    // never show the real error text of our own bugs to the user
    message = "Something went wrong on our side.";
  }
  // short advice for the user, shown under the message
  let hint = "Please go back and try again.";
  if (status === 429) hint = "The trivia API allows only one request per 5 seconds. Wait a moment and try again.";
  if (status === 404) hint = "Check the address or go back to the home page.";
  if (status === 503 || status === 504) hint = "Check your internet connection and try again in a minute.";

  res.status(status).render("error", { title: "Error", status: status, message: message, hint: hint });
};
module.exports = errorHandler;
