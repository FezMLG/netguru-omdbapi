const Movie = require("../models/Movie");
const rolesArray = ["basic", "premium"];
const roles = require("../constant/roles");

const getFirstLastDay = (day) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + day, day === 0 ? 1 : 0);
};

const checkForLimit = async (req, res, next) => {
  if (rolesArray.includes(res.locals.role)) {
    if (res.locals.role == roles.BASIC) {
      try {
        const filter = {
          createdAt: { $gte: getFirstLastDay(0), $lte: getFirstLastDay(1) },
          userId: res.locals.userId,
        };
        const totalBooksPerMonth = await Movie.countDocuments(filter);

        if (totalBooksPerMonth > 4) {
          return res.status(403).send({ message: `Your limit is over` });
        }
      } catch (err) {
        console.error(`Error counting books: ${err.message}`);
        return res.status(500).send({ message: "Error occurred" });
      }
    }
    next();
  } else {
    return res.status(403).send({ message: "Role is invalid " });
  }
};

module.exports = checkForLimit;
