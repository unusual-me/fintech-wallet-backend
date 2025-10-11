import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// Base path mapping for each module
router.use("/auth", authRoutes);

export default router;
