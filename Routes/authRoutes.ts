import { Router } from "express";
import { signUp, signIn } from "../Controller/authControlles";

const router = Router();

router.post('/signup', signUp)
router.post('/signin', signIn)

export default router;