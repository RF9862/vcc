import { Router } from "express";

import {
  createTransaction,
  getBalance,
  getTopUpHistory,
  requestWithdrawal,
} from "../controllers/coinpayments.js";

const router = Router();

router.post("/top-up", createTransaction);
router.get("/top-up-history", getTopUpHistory);
router.get("/balance", getBalance);
router.post("/withdrawal", requestWithdrawal);

export default router;
