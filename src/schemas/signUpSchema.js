import joi from 'joi';

export const usuarioSchema = joi.object({

    nome: joi.string().min(3).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(3).required(),
    confirm: joi.string().min(3).required()

})