import express from "express";
import cors from "cors";
import joi from "joi";
import { signin, signup } from "./src/controllers/user.js";
import { creatTransation, listTransations } from "./src/controllers/transaction.js";

const app = express();
app.use(cors());
app.use(express.json());


const usuarioSchema = joi.object({

    nome: joi.string().min(3).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(3).required(),
    confirm: joi.string().min(3).required()

})

const loginSchema = joi.object({

    email: joi.string().email().required(),
    senha: joi.string().required()

});

const transacaoSchema = joi.object({

    tipo: joi.string().valid('entrada', 'saida'),
    valor: joi.number().greater(0).min(3).required(),
    descricao: joi.string().required()

});

app.post("/cadastro", signup);
app.post("/", signin);
app.post("/nova-transacao/:tipo", creatTransation)
app.get('/home', listTransations)

const PORT = 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

