exports.isAuthenticated = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token === undefined) {
    return res.send("token not found");
  }
  res.send(token);
};
