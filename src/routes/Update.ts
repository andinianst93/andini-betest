import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import { requireAuth } from "../middlewares/RequireAuth";
import { currentUser } from "../middlewares/CurrentUser";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL!);

router.put(
  "/api/v1/users/me",
  currentUser,
  requireAuth,
  [
    body("userName")
      .optional()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("emailAddress")
      .optional()
      .isEmail()
      .withMessage("Email must be valid"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { userName, emailAddress } = req.body;

    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    if (userName) user.userName = userName;
    if (emailAddress) user.emailAddress = emailAddress;

    await user.save();

    await redis.del(`user:${user.accountNumber}`);

    res.send({
      message: "User updated successfully",
      data: {
        id: user.id,
        userName: user.userName,
        emailAddress: user.emailAddress,
      },
    });
  }
);

export { router as updateUserRouter };
