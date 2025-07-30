import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../Model/prismaClient'

const JWT_SECRET = process.env.JWT_SECRET || 'teste'

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existsEmail = await prisma.user.findUnique({ where: { email } });

        if (existsEmail) {
            return res.status(400).json({ error: "Email já cadastrado" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });

    }
};