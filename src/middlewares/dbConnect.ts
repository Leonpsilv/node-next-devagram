import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { defaultResponsesMsg } from '../types/defaultResponsesMsg';
import mongoose from "mongoose";

export const dbConnect = (handler: NextApiHandler) => async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg>
) => {
    if(mongoose.connections[0].readyState){
        return handler(req, res)
    }

    const {DB_CONNECTION} = process.env

    if(!DB_CONNECTION) {
        return res.status(500).json({error: 'variáveis de ambiente do bd não preenchidas'})
    }

    mongoose.connection.on('connected', () => {console.log('BD conectado')})
    mongoose.connection.on('error', error => {console.log(`BD não conectado: ${error}`)})
    await mongoose.connect(DB_CONNECTION)

    return handler(req, res)
}
