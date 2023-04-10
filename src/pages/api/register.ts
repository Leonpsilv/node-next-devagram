import { NextApiRequest, NextApiResponse } from "next";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { reqRegisterUser } from "@/types/reqRegisterUser";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import bcrypt from 'bcrypt';
import { upload, cosmicUploadImage } from "@/services/cosmicUploadImage";
import nc from 'next-connect';

const types = {
    email: {
        regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'email válido!'
    },
    password: {
        regex: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        message: 'A senha precisa conter ao menos 8 caracteres, sendo pelo menos um maiúsculo e um númerico'
    },
}

const registerEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg>
) => {
    try {
        const user = req.body as reqRegisterUser // validando pelo type criado
        if(!user.name || user.name.length < 2) {
            return res.status(400).json({error: 'nome inválido'})
        }

        if(!types['email'].regex.test(user.email)){
            return res.status(400).json({error: types['email'].message})
        }

        if(!types['password'].regex.test(user.password)){
            return res.status(400).json({error: types['password'].message})
        }

        const anExistingUser: any[] = await UserModel.find({email: user.email})
        
        if(anExistingUser && anExistingUser.length > 0)
        return res.status(400).json({error: 'este email já cadastrado'})

        const image = await cosmicUploadImage(req)
        const hashedPassword = await bcrypt.hash(user.password, 12)

        const completedUser = {
            name: user.name,
            email: user.email,
            password: hashedPassword,
            avatar: image?.media?.url
        }
        await UserModel.create(completedUser)

        return res.status(200).json({msg: 'usuário cadastrado com sucesso'})

    } catch(e) {
        return res.status(400).json({error: 'falha ao cadastrar usuário'})  
    }
    
}

const handler = nc()
    .use(upload.single('file'))
    .post(registerEndPoint)

export const config = {
    api: {
        bodyParser: false
    }
}

export default dbConnect(handler)
