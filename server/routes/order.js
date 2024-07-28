import { Router } from "express";

import { getOrderDetails, getOrders } from "../controllers/order.js";

const router = Router();

router.get("/get-orders", getOrders);
router.get("/get-order-details", getOrderDetails);

export default router;
