import type { NextApiRequest, NextApiResponse } from "next";
import { checkOrderStatusAndProcess, getOrderStatus } from "controllers/orders";
import methods from "micro-method-router"
import * as yup from "yup"
import { yupIpnMercadopagoQuery } from "lib/middlewares";

const querySchema = yup.object().shape({
    topic: yup.string().required(),
    id: yup.number().required(),
}).noUnknown(true).strict();



async function postHandler(req:NextApiRequest, res:NextApiResponse) {

    const id = req.query.id as string;
    const topic = req.query.topic as string;
    const order = await getOrderStatus(id,topic);
    const orderId = await checkOrderStatusAndProcess(order);
 
    res.send({
        orderId
    })
}

const handler = methods({
    post: postHandler
})

export default yupIpnMercadopagoQuery(querySchema, handler)
