import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";

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


export default tokenJWTValidator(dbConnect( userEndPoint))