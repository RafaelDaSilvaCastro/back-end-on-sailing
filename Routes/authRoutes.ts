import { Router } from "express";
import { signUp, signIn, refreshToken, updateUser } from "../Controller/authControlles";

const router = Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/refreshtoken', refreshToken)
router.put('/updateuser', updateUser)

export default router;