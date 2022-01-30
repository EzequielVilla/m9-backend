import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import methods from "micro-method-router"
import {yupSearchIndexQuery } from "lib/middlewares";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { findResults } from "controllers/searchs";



const querySchema = yup.object().shape({
    q: yup.string().required(),
    offset:yup.string(),
    limit:yup.string()
});

async function getHandler(req:NextApiRequest, res:NextApiResponse){
    const {limit,offset} = getOffsetAndLimitFromReq(req);
    const results =  await findResults(req,limit,offset)
    res.send({
        results: results.hits,
        pagination:{
            offset,
            limit,
            total: results.nbHits
        }
    })
}
const handler =  methods({
    get: getHandler
})

export default yupSearchIndexQuery(querySchema, handler)
