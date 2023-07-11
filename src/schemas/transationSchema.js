import joi from "joi";

export const transacaoSchema = joi.object({

    tipo: joi.string().valid('entrada', 'saida'),
    valor: joi.number().positive().required(),
    descricao: joi.string().required()

});
