import { Router } from "express";
import userRouter from "./user.routes.js";
import transationsRouter from "./transation.routes.js";


const router = Router();

router.use(userRouter);
router.use(transationsRouter);

export default router;