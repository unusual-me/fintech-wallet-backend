import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);

export default router;
