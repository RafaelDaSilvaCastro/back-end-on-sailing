import { Router } from "express";
import { signUp, signIn, refreshToken } from "../Controller/authControlles";

const router = Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/refreshtoken', refreshToken)

export default router;