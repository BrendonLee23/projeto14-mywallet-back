import db from "../database/db.js";


export async function validateToken(req, res, next) {
    const { authorization } = req.header;
    const token = authorization?.replace('Bearer ', '');
    
    if (!token) return res.sendStatus(401);
    
    try{
        const sessao = await db.collection('sessao').findOne(token);
        if (!sessao) return res.sendStatus(401);

        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
