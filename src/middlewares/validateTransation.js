import { transacaoSchema } from "../schemas/transationSchema.js";

export function validateSchema(req, res, next){
    const transacao = {...req.body, ...req.params}
    const isValidTransaction = transacaoSchema.validate(transacao);
    if (isValidTransaction.error) {
        return res.sendStatus(422)
    }
    next();
}