import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "dotenv/config";

import { NotFoundError } from "./errors/NotFoundError";
import { errorHandler } from "./middlewares/ErrorHandler";

import { health } from "./routes/health";
import { signupRouter } from "./routes/Signup";
import { currentUserRouter } from "./routes/CurrentUser";
import { signinRouter } from "./routes/Signin";
import { signoutRouter } from "./routes/Signout";
import { userByAccountNumberRouter } from "./routes/UserByAccountNumber";
import { userByIdentityNumberRouter } from "./routes/UserByIdentityNumber";
import { updateUserRouter } from "./routes/Update";
import { deleteUserRouter } from "./routes/Delete";

const app = express();

app.use(json());
// development only. In production set secure: true
app.use(
  cookieSession({
    signed: false,
    secure: false,
    sameSite: "strict",
    httpOnly: true,
    path: "/",
  })
);

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log("Cookies:", req.headers.cookie);
  next();
});

// Ensure all route handlers are set
app.use(health);

// Handle users routes
app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(userByAccountNumberRouter);
app.use(userByIdentityNumberRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);

// Handle unknown routes
app.all("*", async () => {
  throw new NotFoundError();
});

// Error-handling middleware with the correct signature
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

export { app };
