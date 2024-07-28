import passport from "../config/passport.js";
import { getFee } from "../controllers/admin.js";
import { handleIPN } from "../controllers/coinpayments.js";
import adminRouter from "./admin.js";
import userRouter from "./auth.js";
import cardRouter from "./card.js";
import coinpaymentsRouter from "./coinpayments.js";
import orderRouter from "./order.js";

const isAdmin = (req, res, next) => {
  if (req.user.privilege !== "admin") {
    return res.status(403).json({ error: "You don't have admin privilege!" });
  }
  next();
};

export default function (app) {
  app.use("/api/auth", userRouter);
  app.post("/api/coinpayments/ipn-handler", handleIPN);
  app.use("/api/get-fee", getFee);

  app.use(
    "/api/coinpayments",
    passport.authenticate("jwt", { session: false }),
    coinpaymentsRouter
  );
  app.use(
    "/api/card",
    passport.authenticate("jwt", { session: false }),
    cardRouter
  );
  app.use(
    "/api/order",
    passport.authenticate("jwt", { session: false }),
    orderRouter
  );
  app.use(
    "/api/admin",
    passport.authenticate("jwt", { session: false }),
    isAdmin,
    adminRouter
  );
}
