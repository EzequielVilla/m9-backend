import type { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth, sendCode } from "controllers/auth";
import { sendCodeEmail } from "lib/sendgrid";
import methods from "micro-method-router"
import * as yup from "yup"
import { yupAuthIndexBody } from "lib/middlewares";

const bodySchema = yup.object().shape({
    email: yup.string().required(),
}).noUnknown(true).strict();

interface reqData{
    email:string
}

async function postHandler(req:NextApiRequest, res:NextApiResponse){
    
    
    const {email} = req.body as reqData
    await findOrCreateAuth(email);
    const auth = await sendCode(email)     
    const emailSended = await sendCodeEmail(email,auth.data.code) 
    res.send({emailSended, code:auth.data.code})
    
}

const handler = methods({
    post: postHandler
})
export default yupAuthIndexBody(bodySchema,handler)