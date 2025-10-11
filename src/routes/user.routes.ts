import { Router } from "express";
import { getProfile, getKycStatus } from "../controllers/user.controller";

const router = Router();

router.get("/me", getProfile);
router.get("/kyc/status", getKycStatus);

export default router;
