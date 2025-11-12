import express from "express"

import { login,  signup,  verifyUserEmail } from "../controllers/userController.js";


export const userRouter = express.Router();

userRouter.post('/signup',signup);

userRouter.get('/verifyUser/:id',verifyUserEmail)

userRouter.post('/login',login);


