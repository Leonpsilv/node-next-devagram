import { NextApiRequest, NextApiResponse } from "next";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { dbConnect } from "@/middlewares/dbConnect";
import { upload, cosmicUploadImage } from "@/services/cosmicUploadImage";
import nc from 'next-connect';
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { UserModel } from "@/models/userModel";
import { PostModel } from "@/models/postModel";

const postEndPoint = async (
    req: any,
    res: NextApiResponse<defaultResponsesMsg>
) => {
    try{
        const {userId} = req.query
        const user = await UserModel.findOne({_id: userId})
        if(!user) return res.status(404).json({error: 'usuário não encontrado'})

        if(!req.body) return res.status(400).json({error: 'parametros de entrada não informados'})
        const {description} = req.body

        if(!description) return res.status(400).json({error:'informe uma descrição!'})

        if(!req.file || !req.file.originalname) return res.status(400).json({error:'a imagem é obrigatória!'})

        const image = await cosmicUploadImage(req)

        const post = {
            userId,
            description,
            image: image.media.url
        }

        await PostModel.create(post)

        const userPosts = await PostModel.find({userId})
        if(user.posts !== userPosts.length){
            await UserModel.findByIdAndUpdate({_id: userId, user})
        }
        
        return res.status(200).json({msg: 'postagem realizada com sucesso!'})
    }catch(e){
        console.log(e)
        return res.status(400).json({error: 'falha ao cadastrar publicação'})  
    }

}

const handler = nc()
    .use(upload.single('file'))
    .post(postEndPoint)

export const config = {
    api: {
        bodyParser: false
    }
}

export default tokenJWTValidator(dbConnect(handler))
