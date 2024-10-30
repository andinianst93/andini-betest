import express from "express";

const router = express.Router();

router.post("/api/v1/users/signout", (req, res) => {
  req.session.jwt = "";

  res.send({
    message: "User signed out",
  });
});

export { router as signoutRouter };
