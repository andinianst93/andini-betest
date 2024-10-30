import express, { Request, Response } from "express";
import { currentUser } from "../middlewares/CurrentUser";
import { requireAuth } from "../middlewares/RequireAuth";
import { User } from "../models/User";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL!);

router.get(
  "/api/v1/users/account/:accountNumber",
  currentUser,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { accountNumber } = req.params;

    // Check Redis cache first
    const cachedUser = await redis.get(`user:${accountNumber}`);
    if (cachedUser) {
      res.send(JSON.parse(cachedUser));
      return;
    }

    const user = await User.findOne({ accountNumber });

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Cache the user data in Redis for future requests
    await redis.set(`user:${accountNumber}`, JSON.stringify(user), "EX", 3600);

    res.send(user);
  }
);

export { router as userByAccountNumberRouter };
