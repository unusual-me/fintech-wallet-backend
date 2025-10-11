import { Router } from "express";
import { getWalletBalance } from "../controllers/wallet.controller";

const router = Router();

router.get("/:walletId/balance", getWalletBalance);

export default router;
