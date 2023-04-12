import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { PostModel } from "@/models/postModel";

const likeEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
       if(req.method === 'PUT'){
           
           const {id} = req?.query
           if(!id) return res.status(400).json({error: 'publicação não informada'})
           
           const {userId} = req?.query
           const user = await UserModel.findById(userId)
           if(!user) return res.status(400).json({error: 'usuário inválido'})
           
           const post = await PostModel.findById(id)
           if(!post) return res.status(400).json({error: 'publicação não encontrado'})

           if(post.likes){
               const indexLikeUser = post.likes.indexOf(userId)
               if(indexLikeUser != -1){
                    post.likes.splice(indexLikeUser, 1)
                    await PostModel.findByIdAndUpdate({_id: id}, post)
                    
                    return res.status(200).json({error: 'publicação descurtida com sucesso'})
               
                }else {
                    post.likes.push(userId)
                    await PostModel.findByIdAndUpdate({_id: id}, post)
                    
                    return res.status(200).json({error: 'publicação curtida com sucesso'})
                }
           }

       }
       return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(400).json({error: 'não foi possível curtir/descurtir o post'})
    }
}


export default tokenJWTValidator(dbConnect(likeEndPoint))