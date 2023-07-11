
import db from "../database/db.js";
import dayjs from "dayjs";


export async function creatTransation (req, res){
    const { valor, descricao } = req.body;
    const { tipo } = req.params
    
    const valorConvertido = parseFloat(valor)

    try {
        const transacaoInfos = {
            value: valorConvertido.toFixed(2),
            description: descricao,
            type: tipo,
            registeredAt: dayjs().format('DD/MM')
        }
        const userId = req.sessao.idUsuario
        const transacaoDB = await db.collection("transacoes").findOne({userId: userId});
        console.log(transacaoDB)
        if(!transacaoDB) {
            const total = transacaoInfos.type === 'entrada' ? Number(transacaoInfos.value) : -transacaoInfos.value;
            await db.collection("transacoes").insertOne({userId: userId, total: total, listaTransacoes: [transacaoInfos]});
        }
        else{
            const total = transacaoInfos.type === 'entrada' ? transacaoDB.total + Number(transacaoInfos.value) : transacaoDB.total - Number(transacaoInfos.value);
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

    try{
        const listagemTransacoes = await db.collection("transacoes").findOne({ userId: req.sessao.idUsuario });
        if (!listagemTransacoes) return res.send(null)
        delete listagemTransacoes.userId
        delete listagemTransacoes._id
        res.send(listagemTransacoes)
    } catch(err){
        return res.status(500).send(err.message);
    }
}
