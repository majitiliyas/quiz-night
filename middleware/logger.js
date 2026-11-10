// Custom middleware: prints time, IP, method, URL, status and duration of every page request
function logger(req, res, next) {
  const start = Date.now();

  // do not log css and images, so the console shows only real pages
  if (req.originalUrl.startsWith("/css") || req.originalUrl.startsWith("/images")) {
    return next();
  }

  // "finish" happens when the response is sent, so we know the status code
  res.on("finish", () => {
    const time = new Date().toLocaleTimeString();
    const duration = Date.now() - start;
    console.log(`${time} | ${req.ip} | ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

module.exports = logger;