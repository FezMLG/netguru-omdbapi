const jwt = require("jsonwebtoken");

const getToken = (invalidType) => (user) => {
  return (
    "Bearer " +
    jwt.sign(
      {
        userId: user.id,
        name: user.name,
        role: invalidType == "userRole" ? "invalidRole" : user.role,
      },
      invalidType == "jwtSecret" ? "invalidToken" : process.env.JWT_SECRET,
      {
        issuer: "https://www.netguru.com/",
        subject: `${user.id}`,
        expiresIn: 30 * 60,
      }
    )
  );
};

module.exports = getToken;
