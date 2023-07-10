import {Router} from "express";
import { creatTransation, listTransations } from "../controllers/transaction.controllers.js";
import { validateSchema } from "../middlewares/validateTransation.js";
import { validateToken } from "../middlewares/validateToken.js";

const transationsRouter = Router()

transationsRouter.post("/nova-transacao/:tipo", validateToken, validateSchema, creatTransation)
transationsRouter.get('/home', validateToken, listTransations)

export default transationsRouter;