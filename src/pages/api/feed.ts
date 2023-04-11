import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import { PostModel } from "@/models/postModel";

const userEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg| any>
) => {
    try{
        if(req.method === 'GET'){
            if(!req?.query.id) return res.status(400).json({error: 'usuário não informado'})
            const anUserId = req?.query.id
            const user = await UserModel.findById(anUserId)
            if(!user) return res.status(404).json({error: 'usuário informado não encontrado'})
            user.password = undefined
        
            const posts = await PostModel
                .find({userId: anUserId})
                .sort({date: -1})
        
            return res.status(200).json(posts)
        }
        return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(400).json({error: 'não foi possível obter os dados desejados'})
    }
}


export default tokenJWTValidator(dbConnect( userEndPoint))