import express, { Request, Response } from "express";
import { currentUser } from "../middlewares/CurrentUser";
import { requireAuth } from "../middlewares/RequireAuth";
import { User } from "../models/User";

const router = express.Router();

router.get(
  "/api/v1/users/identity/:identityNumber",
  currentUser,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { identityNumber } = req.params;
    console.log("Identity Number:", identityNumber);

    const user = await User.findOne({ identityNumber });

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.send(user);
  }
);

export { router as userByIdentityNumberRouter };
