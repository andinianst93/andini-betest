import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/RequireAuth";
import { currentUser } from "../middlewares/CurrentUser";
import { User } from "../models/User";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL!);

router.delete(
  "/api/v1/users/me",
  currentUser,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    await User.findByIdAndDelete(req.currentUser!.id);

    await redis.del(`user:${user.accountNumber}`);

    res.status(200).send({
      message: "User deleted successfully",
    });
  }
);

export { router as deleteUserRouter };
