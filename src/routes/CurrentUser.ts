import express from "express";
import { currentUser } from "../middlewares/CurrentUser";
import { requireAuth } from "../middlewares/RequireAuth";

const router = express.Router();

router.get("/api/v1/users/me", currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
