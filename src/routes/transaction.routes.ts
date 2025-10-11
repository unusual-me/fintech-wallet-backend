import { Router } from "express";
import { deposit, withdraw, getTransactionHistory } from "../controllers/transaction.controller";
import { validateRequest } from "../middleware/validateRequest";
import { depositSchema, withdrawalSchema } from "../utils/validations/transactionSchema";

const router = Router();

// History
router.get("/history", getTransactionHistory);

// Deposit
router.post("/deposit", validateRequest(depositSchema), deposit);

// Withdrawal
router.post("/withdrawal", validateRequest(withdrawalSchema), withdraw);

export default router;
