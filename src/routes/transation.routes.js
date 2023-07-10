import {Router} from "express";
import { creatTransation, listTransations } from "../controllers/transaction.controllers.js";

const transationsRouter = Router()

transationsRouter.post("/nova-transacao/:tipo", creatTransation)
transationsRouter.get('/home', listTransations)

export default transationsRouter;