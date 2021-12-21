import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token: any = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(401).send({ message: "Error occurred" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(401).send({ message: "Error occurred" });
    const decoded: any = jwt.decode(token, process.env.JWT_SECRET);
    res.locals.userId = decoded["userId"];
    res.locals.role = decoded["role"];

    next();
  });
};

export default authenticate;
