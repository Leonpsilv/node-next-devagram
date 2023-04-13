import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { defaultResponsesMsg } from "@/types/defaultResponsesMsg";
import NextCors from 'nextjs-cors';

export const corsPolicy = (handler: NextApiHandler) => async (
        req: NextApiRequest,
        res: NextApiResponse<defaultResponsesMsg>
    ) => {
        try{
            await NextCors(req, res, {
                origin: '*',
                methods: ['POST', 'GET', 'PUT'],
                optionsSuccessStatus : 200,
            })

            return handler(req, res)

        }catch(e){
            return res.status(500).json({error: 'erro ao tratar políticas do CORS'})
        }
        

        return handler(req, res)

    }
