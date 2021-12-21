import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import endpoint from '../config/endpoints.config';
import jwt_decode from "jwt-decode";
import roles from '../constant/roles';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log("trying");
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'User is not authenticated' });
  }
  const token = (authorization as string).split(' ')[1];

  if (!Object.values(roles).includes(res.locals.user?.role)) {
    return res.status(403).send({ message: 'User is not authorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(401).send({ message: "Error occurred" });
    const decoded: any = jwt_decode(token, { header: true });
    res.locals.userId = decoded["userId"];
    res.locals.role = decoded["role"];

    next();
  });
};

export default authenticate;
