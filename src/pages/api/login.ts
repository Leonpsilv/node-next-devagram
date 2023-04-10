import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from '../../middlewares/dbConnect';
import type { defaultResponsesMsg } from '../../types/defaultResponsesMsg';
import bcrypt from 'bcrypt';
import { UserModel } from "@/models/userModel";
import jwt from 'jsonwebtoken';
import { responseLogin } from "@/types/responseLogin";

const loginEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | responseLogin>
) => {
    const {KEY_JWT} = process.env
    if(!KEY_JWT){
        return res.status(500).json({error: 'variável de ambiente não informada'})
    }

    if (req.method === 'POST') {
        const {login, password} = req.body
        const user = await UserModel.findOne({email: login})
        if(!user) return res.status(400).json({error: 'email ou senha incorretos!'})

        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare) return res.status(400).json({error: 'email ou senha incorretos!'})

        const token = jwt.sign({_id: user._id}, KEY_JWT)
        const returnUser = {
            token: token,
            name: user.name,
            email: user.email
        }
        return res.status(200).json(returnUser)

    }
    return res.status(405).json({error: 'método informado não é válido'})
}

export default dbConnect(loginEndPoint)