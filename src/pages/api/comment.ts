import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { UserModel } from "@/models/userModel";
import { PostModel } from "@/models/postModel";
import { corsPolicy } from "@/middlewares/corsPolicy";

const commentEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
       if(req.method === 'PUT'){
        const {userId, id} = req?.query
        if(!id) return res.status(400).json({error:'publicação não informada'})
        if(!userId) return res.status(400).json({error:'usuário logado não informado'})

        const user = await UserModel.findById(userId)
        if(!user) return res.status(400).json({error:'usuário logado não encontrado'})

        const post = await PostModel.findById(id)
        if(!post) return res.status(400).json({error: 'publicação não encontrado'})

        if( !req.body|| !req.body.comment || req.body.comment.length < 2 ) return res.status(400).json({error: 'comentário inválido'})

        const comment = {
            userId: user._id,
            name: user.name,
            avatar: user.avatar,
            comment:req.body.comment
        }

        post.comments.push(comment)
        await PostModel.findByIdAndUpdate({_id: id}, post)
        
        return res.status(200).json({msg: 'comentário adicionado com sucesso'})
       }

       return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(500).json({error: 'erro ao adicionar comentário'})
    }
}


export default corsPolicy(tokenJWTValidator(dbConnect(commentEndPoint)))