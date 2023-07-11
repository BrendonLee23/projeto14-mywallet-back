import bcrypt from "bcrypt";
import db from "../database/db.js";
import { v4 as uuid } from "uuid";


export async function signup(req, res){
    const { nome, email, senha } = req.body;
    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if (usuario) return res.status(409).send("Email ja cadastrado!")
        const hash = bcrypt.hashSync(senha, 10)
        await db.collection("usuarios").insertOne({ nome, email, senha: hash, total:0 });
        res.status(201).send("Usuário registrado com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signin (req, res) {
    const { email, senha } = req.body;
    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(404).send("Email ou senha incorretos!");
        const senhaEstaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaEstaCorreta) return res.status(401).send("Email ou senha incorretos!");
        const token = uuid();
        await db.collection("sessao").findOneAndDelete({idUsuario: usuario._id})
        await db.collection("sessao").insertOne({ token, idUsuario: usuario._id })
        res.status(200).send({token: token, usuario: usuario.nome});
    } catch (err) {
        res.sendStatus(401)
    }
}