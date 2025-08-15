const errorHandlerMiddleware = async (err, req, res, next) => {
  // Sanitize error before logging to prevent log injection
  const sanitizedError = err instanceof Error ? err.message : String(err);
  console.log("Error:", sanitizedError.replace(/[\r\n]/g, ""));
  
  // Handle different error types with appropriate status codes
  const statusCode = err.statusCode || err.status || 500;
  
  return res
    .status(statusCode)
    .json({ msg: "Something went wrong, please try again" });
};
module.exports = errorHandlerMiddleware;
