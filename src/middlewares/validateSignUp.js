import { usuarioSchema } from "../schemas/signUpSchema.js";

export function validateSignUp(req, res, next){
    const validation = usuarioSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    next();
}