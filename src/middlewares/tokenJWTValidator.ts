import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import jwt, { JwtPayload } from "jsonwebtoken";

export const tokenJWTValidator = (handler: NextApiHandler) => (
        req: NextApiRequest,
        res: NextApiResponse<defaultResponsesMsg>
    ) => {
        try{
            const {KEY_JWT} = process.env
            if(!KEY_JWT){
                return res.status(500).json({error: 'variável de ambiente não informada'})
            }

            if(!req || !req.headers){
                return res.status(401).json({error: 'não foi possível validar o token de autorização'})
            }

            if(req.method !== 'OPTIONS'){
                const authorization = req.headers['authorization']
                if(!authorization){
                    return res.status(401).json({error: 'não foi possível validar o token de autorização'})
                }

                const token = authorization?.split(' ')[1]
                if(!token){
                    return res.status(401).json({error: 'não foi possível validar o token de autorização'})
                }

                const decoded = jwt.verify(token, KEY_JWT) as JwtPayload
                if(!decoded){
                    return res.status(401).json({error: 'não foi possível validar o token de autorização'})
                }

                if(!req.query){
                    req.query = {}
                }

                req.query.userId = decoded._id
            }

        }catch(e){
            return res.status(401).json({error: 'não foi possível validar o token de autorização'})
        }
        

        return handler(req, res)

    }
