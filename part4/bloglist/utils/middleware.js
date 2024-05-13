const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.slice(7);
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.slice(7);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    User.findById(decodedToken.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to fetch user" });
      });
  } else {
    req.user = null;
    next();
  }
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
