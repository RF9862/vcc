import { Router } from "express";

import {
  getCardDetails,
  getCards,
  getMyCards,
  openCard,
  rechargeCreditCard,
  terminateCard,
} from "../controllers/card.js";

const router = Router();

router.get("/get-cards", getCards);
router.get("/get-my-cards", getMyCards);
router.post("/open-card", openCard);
router.get("/get-card-details", getCardDetails);
router.post("/recharge-credit-card", rechargeCreditCard);
router.post("/terminate-card", terminateCard);

export default router;
