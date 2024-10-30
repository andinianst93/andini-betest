import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  emailAddress: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session: {
        jwt: string;
      };
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    console.log("No JWT found in session");
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
    console.log("Current user set:", payload);
  } catch (err) {
    console.log("JWT verification failed:", err);
  }

  next();
};
