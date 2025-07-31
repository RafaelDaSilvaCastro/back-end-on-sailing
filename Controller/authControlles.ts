import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../Model/prismaClient'

const JWT_SECRET = process.env.JWT_SECRET || String(new Date().getTime());

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

        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });

    }
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try{
        const user = await prisma.user.findUnique({ where: { email }})

        if(!user){
            return res.status(400).json({ error: "Email ou senha inválidos" });
        }
        else{
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                return res.status(400).json({ error: "Email ou senha inválidos" });
            }

            const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1d' });

            res.status(200).json({ token });
        }
    }
    catch(err){

    }
}