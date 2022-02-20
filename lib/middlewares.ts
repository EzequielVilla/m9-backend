import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import parseToken from "parse-bearer-token";
import {decode} from "lib/jwt"
import NextCors from 'nextjs-cors';

interface YupFunction{
    (req:NextApiRequest,res:NextApiResponse):Promise<void>
}
interface callbackFunction{
    (req:NextApiRequest,res:NextApiResponse):void
}


export function authMiddleware(callback? ){    
    return function(req:NextApiRequest, res:NextApiResponse){
        const token = parseToken(req)
        if(!token){
            res.status(401).send({
                message: "No hay decodedToken"
            })
        }
        const decodedToken:string = decode(token)        
        if(decodedToken){
            callback(req,res, decodedToken);
        } else{
            res.status(401).send({mesagge: "Token incorrecto"})
        } 
    }
}


//Two checks for AUTH API endpoint
export function yupAuthIndexBody(bodySchema:yup.ObjectSchema<any>,callback:callbackFunction):YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        await NextCors(req, res, {
            // Options
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            origin: '*',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
         });
        try{
            await bodySchema.validate(req.body)
            callback(req,res)           
        }catch(e){            
            res.status(422).send({field:"body", message: e})
        }
    }
}
export function yupAuthTokenBody(bodySchema:yup.ObjectSchema<any>,callback:callbackFunction):YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await bodySchema.validate(req.body)
            callback(req,res)           
        }catch(e){
            res.status(422).send({field:"body", message: e})
        }
    }
}
//
//ME
export function yupMeIndexBody(bodySchema:yup.ObjectSchema<any>, callback:callbackFunction):YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await bodySchema.validate(req.body)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"body", message: e})
        }
    }
}
//ADDRESS
export function yupAddressIndexBody(bodySchema:yup.ObjectSchema<any>, callback:callbackFunction):YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await bodySchema.validate(req.body)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"body", message: e})
        }
    }
}
//SEARCH

export function yupSearchIndexQuery(querySchema:yup.ObjectSchema<any>, callback:callbackFunction):YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}

//PRODUCTS
export function yupProductsIdQuery (querySchema:yup.ObjectSchema<any>, callback:callbackFunction): YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}
//ORDER
export function yupOrderQuery (querySchema:yup.ObjectSchema<any>, callback:callbackFunction): YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}
export function yupOrderIdquery (querySchema:yup.ObjectSchema<any>, callback:callbackFunction): YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}
//IPN-MERCADOPAGO/
export function yupIpnMercadopagoQuery (querySchema:yup.ObjectSchema<any>, callback:callbackFunction): YupFunction{
    return async function(req:NextApiRequest,res:NextApiResponse): Promise<void>{   
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}