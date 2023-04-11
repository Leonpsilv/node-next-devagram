import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";
import { dbConnect } from "@/middlewares/dbConnect";
import { UserModel } from "@/models/userModel";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";

const userEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultResponsesMsg | any>
) => {
    try{
        if(req.method === 'GET'){
            const {filter} = req.query
            if(!filter || filter.length < 2) return res.status(204).json(null)

            const foundUsers = await UserModel.find({
                $or: [
                    {name: {$regex: filter, $options: 'i'}},
                    {email: {$regex: filter, $options: 'i'}}
                ]
            })

            return res.status(200).json({foundUsers})
        }
        return res.status(405).json({error: 'método informado não é válido'})
    }catch(e){
        return res.status(500).json({error: 'não foi possível buscar usuários'})
    }
}


export default tokenJWTValidator(dbConnect( userEndPoint))