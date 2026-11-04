// Custom middleware: prints method, URL, status and time of every request
function logger(req, res, next) {
  const start = Date.now();

  // "finish" happens when the response is sent, so we know the status code
  res.on("finish", () => {
    const time = new Date().toLocaleString();
    const duration = Date.now() - start;
    console.log(`[${time}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

module.exports = logger;
