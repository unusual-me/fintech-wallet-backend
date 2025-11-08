import { Router } from "express";
import { getWalletBalance } from "../controllers/wallet.controller";

const router = Router();

router.get("/balance", getWalletBalance);

export default router;
