import { Router } from "express";
import { signUp } from "../Controller/authControlles";

const router = Router();

router.post('/signup', signUp)

export default router;