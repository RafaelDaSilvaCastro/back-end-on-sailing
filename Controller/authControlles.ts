import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../Model/prismaClient'

const JWT_SECRET = process.env.JWT_SECRET || String(new Date().getTime());

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password, phone, birthDate } = req.body;

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
                password: hashPassword, 
                phone: phone || null,
                birthDate: birthDate ? new Date(birthDate) : null
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

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token: newToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }


}

export const updateUser = async (req: Request, res: Response) => {
    const { id, name, email, phone, birthDate, isActive } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const userId = decoded.userId;

        const existingUser = await prisma.user.findUnique({ where: { userId } });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if (id !== existingUser.userId) {
            return res.status(400).json({ error: "ID do usuário não corresponde ao usuário autenticado" });
        }

        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                return res.status(400).json({ error: "Email já cadastrado" });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { userId },
            data: {
                name: name || existingUser.name,
                email: email || existingUser.email,
                phone: phone !== undefined ? phone : existingUser.phone,
                birthDate: birthDate ? new Date(birthDate) : existingUser.birthDate,
                isActive: isActive !== undefined ? isActive : existingUser.isActive
            }
        });

        res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário", details: error });
    }
};