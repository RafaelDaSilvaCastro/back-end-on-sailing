import { Router } from "express";
import { singUp } from "../Controller/authControlles";

const router = Router();

router.post('/singup', singUp)

export default router;