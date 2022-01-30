import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import methods from "micro-method-router"
import { yupProductsIdQuery } from "lib/middlewares";
import { findResultById } from "controllers/searchs";


const querySchema = yup.object().shape({
    id: yup.string().required(),
});


async function getHandler(req:NextApiRequest, res:NextApiResponse){
    
    const result = await findResultById(req)
    
    res.send({
        result
    })
}

const handler =  methods({
    get: getHandler
})

export default yupProductsIdQuery(querySchema, handler)
