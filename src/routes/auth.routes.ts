import { Router } from "express";
import { signup, login, changePassword } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", changePassword);

export default router;
