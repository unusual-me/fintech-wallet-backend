import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import walletRoutes from "./wallet.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

// Base path mapping for each module
router.use("/v1/auth", authRoutes);
router.use("/v1/users", userRoutes);
router.use("/v1/wallets", walletRoutes);
router.use("/v1/transactions", transactionRoutes);

export default router;
