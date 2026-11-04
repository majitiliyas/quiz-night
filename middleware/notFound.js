// 404 handler: runs when no route matched the URL
function notFound(req, res, next) {
  res.status(404).render("404", { title: "Not found", url: req.originalUrl });
}

module.exports = notFound;
