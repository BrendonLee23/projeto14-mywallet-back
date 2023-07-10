import { transacaoSchema } from "../../app.js";
import db from "../database/db.js";
import dayjs from "dayjs";


export async function creatTransation (req, res){

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
}
export async function listTransations(req, res){
    
    const { authorization } = req.header;

    const token = authorization?.replace('Bearer ', '');

    try{
        const listagemTransacoes = await db.collection("transacoes").findOne({ token: token });
        if (!listagemTransacoes) return res.send(null)
        delete listagemTransacoes.userId
        delete listagemTransacoes._id
        res.send(listagemTransacoes)
    } catch(err){
        return res.status(500).send(err.message);
    }
}