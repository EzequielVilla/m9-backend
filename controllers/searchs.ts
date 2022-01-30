
import { getResultsFromQuery, searchById } from "models/products";
import type { NextApiRequest, NextApiResponse } from "next";

export async function findResults(req:NextApiRequest,limit:number,offset:number):Promise<any>{
    return await getResultsFromQuery(req.query.q as string,limit,offset);
}

export async function findResultById(req:NextApiRequest):Promise<any>{
    
    const id = req.query.id as string;
    return searchById(id);
}