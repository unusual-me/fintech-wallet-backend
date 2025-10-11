import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import walletRoutes from "./wallet.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

// Base path mapping for each module
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
router.use("/transactions", transactionRoutes);

export default router;
