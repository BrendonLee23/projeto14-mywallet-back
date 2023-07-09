import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();
    console.log("MongoDB CONECTADO!")
} catch (err) {
    console.log(err.message)
}
const db = mongoClient.db();



const usuarioSchema = joi.object({

    nome: joi.string().min(3).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(3).required(),
    confirm: joi.string().min(3).required()

})

const loginSchema = joi.object({

    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    senha: joi.string().required()

});

const transacaoSchema = joi.object({

    tipo: joi.string().valid('entrada', 'saida'),
    valor: joi.number().greater(0).min(3).required(),
    descricao: joi.string().required()

});

app.post("/cadastro", async (req, res) => {
    const { nome, email, senha, confirm } = req.body;

    const validation = usuarioSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if (usuario) return res.status(409).send("Email ja cadastrado!")

        const hash = bcrypt.hashSync(senha, 10)

        await db.collection("usuarios").insertOne({ nome, email, senha: hash });
        res.status(201).send("Usuário registrado com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/", async (req, res) => {
    const { email, senha } = req.body;

    const validation = loginSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(404).send("Usuario não foi cadastrado!");

        const senhaEstaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaEstaCorreta) return res.status(401).send("Senha incorreta!");

        const token = uuid();

        await db.collection("sessao").findOneAndDelete({idUsuario: usuario._id})
        await db.collection("sessao").insertOne({ token, idUsuario: usuario._id })

        res.status(200).send({token: token, usuario: usuario.nome});

    } catch (err) {
        res.sendStatus(401)
    }
});

app.post("/nova-transacao/:tipo", async (req, res) => {

    const { valor, descricao } = req.body;
    const { tipo } = req.params
    const { authorization } = req.header;

    const token = authorization?.replace('Bearer ', '');

    const transacao = {...req.body, ...req.params}

    const isValidTransaction = transacaoSchema.validate(transacao);

    if (isValidTransaction.error) {
        return res.sendStatus(422);
    }
    try {
        const sessao = await db.collection('sessao').findOne(token);

        if (!sessao) {

            return res.sendStatus(401);
        }
        const transacaoInfos = {
            value: parseFloat(valor.toFixed(2)),
            description: descricao,
            type: tipo,
            registeredAt: dayjs().format('DD/MM')
        }

        const userId = sessao.idUsuario

        const transacaoDB = await db.collection("transacoes").findOne({userId: userId});
        console.log(transacaoDB)
        if(!transacaoDB) {
            const total = transacaoInfos.type === 'entrada' ? transacaoInfos.value : -transacaoInfos.value;
            await db.collection("transacoes").insertOne({userId: userId, total: total, listaTransacoes: [transacaoInfos]});
        }
        else{
            const total = transacaoInfos.type === 'entrada' ? transacaoDB.total + transacaoInfos.value : transacaoDB.total - transacaoInfos.value;
            await db.collection("transacoes").updateOne({userId: userId},
                {
                    $set : {total: total}, $push: {listaTransacoes: transacaoInfos}
                }
            );
        }

        res.status(201).send("Transação registrada com sucesso!")

    } catch (err) {
        return res.status(500).send(err.message);
    }
})



const PORT = 5000;
app.listen(PORT, () => console.log('listening on port ${PORT}'));

