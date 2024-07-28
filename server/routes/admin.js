import { Router } from "express";

import {
  changeUserPrivilege,
  changeUserStatus,
  getOrders,
  getUsers,
  setFee,
} from "../controllers/admin.js";

const router = Router();

router.post("/set-fee", setFee);
router.post("/change-user-status", changeUserStatus);
router.post("/change-user-privilege", changeUserPrivilege);
router.get("/get-users", getUsers);
router.get("/get-orders", getOrders);

export default router;
