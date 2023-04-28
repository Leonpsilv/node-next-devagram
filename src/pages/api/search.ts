import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { corsPolicy } from "@/middlewares/corsPolicy";
import { FollowModel } from "@/models/followModel";

const searchEndPoit = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const {userId} = req.query

                const searchUser = await UserModel.findById(req?.query?.id)
                if(!searchUser) return res.status(400).json({error: 'usuário não encontrado'})
                searchUser.password = undefined

                const follow = await FollowModel.find({userId, userIdFollowed: req?.query?.id})
                const followBoolean = follow.length === 0 ? false : true
                const formatedData = {
                    _id: searchUser._id,
                    name: searchUser.name,
                    email: searchUser.email,
                    avatar: searchUser.avatar,
                    followers: searchUser.followers,
                    following: searchUser.following,
                    posts: searchUser.posts,
                    __v: searchUser.__v,
                    followingUser: followBoolean
                }

                return res.status(200).json(formatedData)
            }else{
                const {filter} = req.query
                if(!filter || filter.length < 2) return res.status(204).json(null)
    
                const foundUsers = await UserModel.find({
                    $or: [
                        {name: {$regex: filter, $options: 'i'}},
                        {email: {$regex: filter, $options: 'i'}}
                    ]
                })

                if(foundUsers && foundUsers.length > 0){
                    foundUsers.forEach(user => {user.password = undefined})
                }
    
                return res.status(200).json(foundUsers)
            }

        }
        return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(500).json({error: 'não foi possível buscar usuários'})
    }
}


export default corsPolicy(tokenJWTValidator(dbConnect(searchEndPoit)))