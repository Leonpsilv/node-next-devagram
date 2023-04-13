import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import nc from 'next-connect';
import { upload, cosmicUploadImage } from "@/services/cosmicUploadImage";
import { corsPolicy } from "@/middlewares/corsPolicy";

const updateUserEndPoint = async (
    req: any,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
        const {userId} = req?.query
        const user = await UserModel.findOne({_id: userId})
        if(!user) return res.status(404).json({error: 'usuário informado não encontrado'})
        user.password = undefined

        const {name} = req.body
        if(name && name.length > 2) {
            user.name = name
        }

        const {file} = req
        if(file && file.originalname){
            const image = await cosmicUploadImage(req)
            if(image && image.media && image.media.url){
                user.avatar = image?.media?.url
            }
        }
        if((name && name.length > 2) || (file && file.originalname)){
            await UserModel.findByIdAndUpdate({_id: userId}, user)
            return res.status(200).json({msg: 'usuário alterado com sucesso'})
        }
        
        return res.status(200).json({msg: 'nenhum dado identificado para ser alterado.'})
    
    }catch(e){
        return res.status(400).json({error: 'não foi possível atualizar os dados do usuário'})
    }
}

const userEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg| any>
) => {
    try{
        const {userId} = req?.query
        const user = await UserModel.findOne({_id: userId})
        if(!user) return res.status(404).json({error: 'usuário informado não encontrado'})
        user.password = undefined
    
        return res.status(200).json(user)
    }catch(e){
        return res.status(400).json({error: 'não foi possível obter os dados do usuário'})
    }
}

const handler = nc()
    .use(upload.single('file'))
    .put(updateUserEndPoint)
    .get(userEndPoint)

export const config = {
    api: {
        bodyParser: false
    }
}


export default corsPolicy(tokenJWTValidator(dbConnect(handler)))