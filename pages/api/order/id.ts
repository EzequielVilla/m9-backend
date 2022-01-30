import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import * as yup from "yup"
import { authMiddleware, } from "lib/middlewares";



const bodySchema = yup.object().shape({
    productId: yup.string().required(), 
}).noUnknown(true).strict();


async function getHandler(req:NextApiRequest, res:NextApiResponse,token) {
    const productId = req.query.productId as string;
    
}



const get = authMiddleware(getHandler)
const handler =  methods({
    get,
})

// export default yupOrderQuery(bodySchema,handler)