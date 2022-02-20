import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import parseToken from "parse-bearer-token";
import {decode} from "lib/jwt"
import Cors from 'cors'

interface YupFunction{
    (req:NextApiRequest,res:NextApiResponse):Promise<void>
}
interface callbackFunction{
    (req:NextApiRequest,res:NextApiResponse):void
}




// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST'],
  })
)
export default function initMiddleware(middleware) {
    return (req, res) =>
      new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
          if (result instanceof Error) {
            return reject(result)
          }
          return resolve(result)
        })
      })
  }


export function authMiddleware(callback? ){    
    return async function(req:NextApiRequest, res:NextApiResponse){
        await cors(req, res)
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
        await cors(req, res)   
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
        await cors(req, res)
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
        await cors(req, res)
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
        await cors(req, res) 
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
        await cors(req, res)   
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
        await cors(req, res)
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
        await cors(req, res) 
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
        await cors(req, res)  
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
        await cors(req, res) 
        try{
            await querySchema.validate(req.query)
            callback(req,res)
        }catch(e){
            res.status(422).send({field:"query", message: e})
        }
    }
}