import joi from "joi";

export const transacaoSchema = joi.object({

    tipo: joi.string().valid('entrada', 'saida'),
    valor: joi.number().greater(0).min(3).required(),
    descricao: joi.string().required()

});
