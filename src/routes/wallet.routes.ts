import { Router } from "express";
import { getWalletBalance } from "../controllers/wallet.controller";

const router = Router();

router.post("/balance", getWalletBalance);

export default router;
