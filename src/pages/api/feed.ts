import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { PostModel } from "@/models/postModel";
import { FollowModel } from "@/models/followModel";

const feedEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg| any>
) => {
    try{
        if(req.method === 'GET'){
            if(req?.query.id){
                const anUserId = req?.query.id
                const user = await UserModel.findById(anUserId)
                if(!user) return res.status(400).json({error: 'usuário informado não encontrado'})
                user.password = undefined
            
                const posts = await PostModel
                    .find({userId: anUserId})
                    .sort({date: -1})
            
                return res.status(200).json(posts)
            }else {
                const {userId} = req?.query
                const user = await UserModel.findById(userId)
                if(!user) return res.status(400).json({error: 'usuário não encontrado'})

                const following = await FollowModel.find({userId})
                const followingIds = following.map(user => user.userIdFollowed)

                const posts = await PostModel.find({
                    $or:[
                        {userId},
                        {userId: followingIds}
                    ]
                })
                .sort({date: -1})

                const result = []
                for (const post of posts) {
                    const postUser = await UserModel.findById(post.userId)
                    if(postUser){
                        const final = {...post._doc, user: {
                            name: postUser.name,
                            avatar: postUser.avatar
                        }}
                        result.push(final)
                    }
                }

                return res.status(200).json(result)
            }
        }
        return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        // console.log(e)
        return res.status(400).json({error: 'não foi possível obter os dados desejados'})
    }
}


export default tokenJWTValidator(dbConnect(feedEndPoint))