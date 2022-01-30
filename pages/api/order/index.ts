import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import * as yup from "yup"
import { authMiddleware, yupOrderQuery } from "lib/middlewares";
import { getRedirectAndCreateOrder } from "controllers/orders";

const bodySchema = yup.object().shape({
    productId: yup.string().required(), 
    data:yup.object()
});
interface dataFromBody{
    data:{}
}


async function getHandler(req:NextApiRequest, res:NextApiResponse,token) {
    const productId = req.query.productId as string;
    const {data} = req.body as dataFromBody; 

    const pageToRedirect = await getRedirectAndCreateOrder(productId,token, data)
    res.send({
        redirecTo: pageToRedirect
    })
}



const get = authMiddleware(getHandler)
const handler =  methods({
    get,
})

export default yupOrderQuery(bodySchema,handler)