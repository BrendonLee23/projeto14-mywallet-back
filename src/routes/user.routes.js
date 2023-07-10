import {Router} from "express";
import { signin, signup } from "../controllers/user.controllers.js";
import { validateSignUp } from "../middlewares/validateSignUp.js";
import { validateSignIn } from "../middlewares/validateSignIn.js";

const userRouter = Router()

userRouter.post("/cadastro", validateSignUp,signup);
userRouter.post("/", validateSignIn, signin);

export default userRouter;