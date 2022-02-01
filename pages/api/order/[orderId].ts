import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import * as yup from "yup"
import { authMiddleware, yupOrderIdquery, } from "lib/middlewares";
import { getOrderFromDB } from "controllers/orders";
import { Order } from "models/orders";



const bodySchema = yup.object().shape({
    orderId: yup.string().required(), 
}).noUnknown(true).strict();


async function getHandler(req:NextApiRequest, res:NextApiResponse) {
    const orderId = req.query.orderId as string;
    const data = await getOrderFromDB(orderId);
    res.send({data})
}




const handler =  methods({
    get:getHandler,
})

export default yupOrderIdquery(bodySchema,handler)