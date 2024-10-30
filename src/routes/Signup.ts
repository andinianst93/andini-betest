import "dotenv/config";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/ValidateReq";
import { User } from "../models/User";
import { BadRequestError } from "../errors/BadRequestError";
import { generateAccountNumber } from "../services/AccountNumber";
import { generateIdentityNumber } from "../services/IdentityNumber";

const router = express.Router();

router.post(
  "/api/v1/users/signup",
  [
    body("emailAddress").isEmail().withMessage("Email must be valid"),
    body("userName")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailAddress, userName, password } = req.body;

    const existingEmail = await User.findOne({ emailAddress });
    if (existingEmail) {
      throw new BadRequestError("Invalid credentials");
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      throw new BadRequestError("Invalid credentials");
    }

    const accountNumber = generateAccountNumber();
    const identityNumber = generateIdentityNumber();

    const user = User.build({
      emailAddress,
      userName,
      password,
      accountNumber,
      identityNumber,
    });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        emailAddress: user.emailAddress,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({
      message: "User created successfully",
      data: user,
    });
  }
);

export { router as signupRouter };
