import "dotenv/config";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Password } from "../services/Password";
import { User } from "../models/User";
import { validateRequest } from "../middlewares/ValidateReq";
import { BadRequestError } from "../errors/BadRequestError";

const router = express.Router();

router.post(
  "/api/v1/users/signin",
  [
    body("userName")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("emailAddress").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userName, emailAddress, password } = req.body;

    const existingUser = await User.findOne({ userName, emailAddress });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.emailAddress,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({
      message: "User signed in successfully",
      data: existingUser,
    });
  }
);

export { router as signinRouter };
