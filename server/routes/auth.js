import { Router } from "express";

import passport from "../config/passport.js";
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
  signin,
  signup,
} from "../controllers/user.js";

const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  changePassword
);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
