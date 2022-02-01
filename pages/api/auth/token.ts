import type { NextApiRequest, NextApiResponse } from "next";
import { checkCodeAndExpiration } from "controllers/auth";
import { Auth } from "models/auth";
import { generate } from "lib/jwt";
import methods from "micro-method-router"
import * as yup from "yup"
import { yupAuthTokenBody } from "lib/middlewares";

interface dataFromEmail{
    email:string,
    code:number,
    expires:Timestamp,
    userId:string
}
interface reqData{
    email:string,
    code: number,
}
const bodySchema = yup.object().shape({
    email: yup.string().required(),
    code: yup.number().required(),
}).noUnknown(true).strict();


async function postHandler(req:NextApiRequest, res:NextApiResponse) {
    const {email,code} = req.body as reqData;
    const info = await Auth.findByEmail(email);    
    const data = info.data as dataFromEmail;
    const correctInfo = checkCodeAndExpiration(data.code, code , data.expires)
    if(correctInfo){
        let token = generate({userId:data.userId})
        res.send({token})
    }else{
        res.status(401).send({message: "Wrong code or email"})
    }    
}

const handler =  methods({
    post: postHandler
})

export default yupAuthTokenBody(bodySchema,handler)