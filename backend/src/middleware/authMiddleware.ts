import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({
            message: "Authorization header missing or invalid"
        });
        return;
    }

    const token = authHeader!.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as unknown as string) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: "Can't verify token, Token rejected"
        });
        return;
    }
}