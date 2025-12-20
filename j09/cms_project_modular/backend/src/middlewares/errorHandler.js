module.exports = function errorHandler(err, res){
  const status = err.status || 500;
  const message = err.message || "Server error";
  if(process.env.NODE_ENV !== "production"){
    console.error(err);
  }
  res.status(status).send(message);
}
