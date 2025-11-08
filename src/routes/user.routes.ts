import { Router } from "express";
import { getProfile, getKycStatus } from "../controllers/user.controller";

const router = Router();

router.post("/v1/me", getProfile);
router.get("/v1/kyc/status", getKycStatus);

export default router;
