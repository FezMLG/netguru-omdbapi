import Movie from "../models/Movie";
const rolesArray = ["basic", "premium"];
import roles from "../constant/roles";
import { NextFunction, Request, Response } from "express";

type FirstLast = 0 | 1;

const getFirstLastDay = (day: FirstLast) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + day, day === 0 ? 1 : 0);
};

const checkForLimit = async (req: Request, res: Response, next: NextFunction) => {
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
      } catch (err: any) {
        console.error(`Error counting books: ${err.message}`);
        return res.status(500).send({ message: "Error occurred" });
      }
    }
    next();
  } else {
    return res.status(403).send({ message: "Role is invalid " });
  }
};

export default checkForLimit;
