import { NextApiRequest,NextApiResponse } from "next";
import { tokenJWTValidator } from "@/middlewares/tokenJWTValidator";

const userEndPoint = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    return res.status(200).json({msg: 'usuario autenticado com sucesso'})
}


export default tokenJWTValidator(userEndPoint)