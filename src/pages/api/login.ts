import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from '../../middlewares/dbConnect';
import type { defaultResponsesMsg } from '../../types/defaultResponsesMsg';
import bcrypt from 'bcrypt';
import { UserModel } from "@/models/userModel";

const loginEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg>
) => {
    if (req.method === 'POST') {
        const {login, password} = req.body
        const user = await UserModel.findOne({email: login})
        if(!user) return res.status(400).json({error: 'email ou senha incorretos!'})

        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare) return res.status(400).json({error: 'email ou senha incorretos!'})
        
        return res.status(200).json({msg: `usuário ${user.name} autenticado com sucesso!`})

    }
    return res.status(405).json({error: 'método informado não é válido'})
}

export default dbConnect(loginEndPoint)