const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(401).send({ message: "Error occurred" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send({ message: "Error occurred" });

    req.user = user;

    const decode = jwt.decode(token, process.env.JWT_SECRET);
    res.locals.userId = decode["userId"];
    res.locals.role = decode["role"];

    next();
  });
};

module.exports = authenticate;
