import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import methods from "micro-method-router"
import { yupProductsIdQuery } from "lib/middlewares";
import { findResultById } from "controllers/searchs";


const querySchema = yup.object().shape({
    id: yup.string().required(),
}).noUnknown(true).strict();


async function getHandler(req:NextApiRequest, res:NextApiResponse){
    
    const result = await findResultById(req)
    if(result){
        res.send({
            result
        })
    }
    else{
        res.send({
            message: "No product finded with that id"
        })
    }
}

const handler =  methods({
    get: getHandler
})

export default yupProductsIdQuery(querySchema, handler)
