import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { FollowModel } from "@/models/followModel";
import { corsPolicy } from "@/middlewares/corsPolicy";

const followEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
       if(req.method === 'PUT'){
           const {userId, id} = req?.query
           if(id == userId) return res.status(400).json({error: 'usuário logado não pode seguir a si mesmo'})
           if(!id) return res.status(400).json({error:'usuário requisitado para o follow/unfollow não informado'})
           if(!userId) return res.status(400).json({error:'usuário logado não informado'})
           
           const user = await UserModel.findById(userId)
           if(!user) return res.status(400).json({error:'usuário logado não encontrado'})
           
           const userFollowed = await UserModel.findById(id)
           if(!userFollowed) return res.status(400).json({error:'usuário requisitado para o follow/unfollow não encontrado'})

           const loggedUserFollow = await FollowModel.find({userId, userIdFollowed: id})

           if(loggedUserFollow && loggedUserFollow.length > 0){
                loggedUserFollow.forEach(async (follow) => await FollowModel.findByIdAndDelete({_id: follow._id}))
                
                user.following--
                await UserModel.findByIdAndUpdate({_id: userId}, user)
                
                userFollowed.followers--
                await UserModel.findByIdAndUpdate({_id: id}, userFollowed)
                
                return res.status(200).json({msg: 'unfollow realizado com sucesso'})

           }else{
                const follow = {userId, userIdFollowed: id}
                await FollowModel.create(follow)
                
                user.following++
                await UserModel.findByIdAndUpdate({_id: userId}, user)
                
                userFollowed.followers++
                await UserModel.findByIdAndUpdate({_id: id}, userFollowed)

                return res.status(200).json({msg: 'usuário seguido com sucesso'})
           }
          
       }
       return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(400).json({error: 'não foi possível dar follow/unfollow nesse usuário'})
    }
}


export default corsPolicy(tokenJWTValidator(dbConnect(followEndPoint)))