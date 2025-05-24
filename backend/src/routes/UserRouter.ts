import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthSchema } from "../types/Schemas";
import { UserModel } from "../db/db";
import dotenv from "dotenv";
dotenv.config();

export const UserRouter = Router();
const salt_rounds = 3;

UserRouter.post('/register', async (req: Request, res: Response) => {
    try {

        const {success, data, error} = AuthSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Error in inputs",
                errors: error.errors
            });
        } else {
            const hashPass = await bcrypt.hash(data.password, salt_rounds);
            await UserModel.create({
                email: data.email,
                password: data.password
            })
            res.status(200).json({
                message: "User created"
            })
        }
        } catch (err) {
        console.error(err);
        res.status(403).json({
            message: err
        })
    }
})

UserRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const {success, data, error} = AuthSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Error in inputs",
                errors: error.errors
            })
            return ;
        } else {
            const existingUser = await UserModel.findOne({
                email: data.email
            }) 
            if (existingUser) {
                const match = await bcrypt.compare(data.email, data.password);
                if (match) {
                    const token = jwt.sign({
                        id: existingUser._id
                    }, process.env.JWT_SECRET as unknown as string)
                    
                    res.status(200).json({
                        message: "Login Successful, token created and set",
                        token: token
                    })

                    return ;
                } else {
                    res.status(401).json({
                        message: "Password incorrect, please try again later"
                    })
                    return ;
                }

            } else {
                res.status(404).json({
                    message: "User doesn't exist, please sign up"
                });
                return;
            }
        }
    } catch (err) {
        console.error(err);
        throw new Error("Error while login route " + err);
    }
})