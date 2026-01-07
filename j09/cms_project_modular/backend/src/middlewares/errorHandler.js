module.exports = function errorHandler(err, res){
  const status = err.status || 500;
  const message = err.message || "Server error";
  res.status(status).send(message);
}
