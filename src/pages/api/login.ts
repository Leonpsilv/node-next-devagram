import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from '../../middlewares/dbConnect';
import type { defaultResponsesMsg } from '../../types/defaultResponsesMsg';

const loginEndPoint = (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg>
) => {
    if (req.method === 'POST') {
        const {login, password} = req.body

        if (login === 'admin' && password === '123'){
            return res.status(200).json({msg: 'login realizado com sucesso!'})
        }
        return res.status(400).json({error: 'login ou senha incorretos'})
    }
    return res.status(405).json({error: 'método informado não é válido'})
}

export default dbConnect(loginEndPoint)