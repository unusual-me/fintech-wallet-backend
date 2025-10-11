import { Router } from "express";
import { signup, login, changePassword } from "../controllers/auth.controller";

const router = Router();

router.post("/v1/signup", signup);
router.post("/v1/login", login);
router.post("/v1/changePassword", changePassword);

export default router;
