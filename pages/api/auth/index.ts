import type { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth, sendCode } from "controllers/auth";
import { sendCodeEmail } from "lib/sendgrid";
import methods from "micro-method-router"
import * as yup from "yup"
import initMiddleware, { yupAuthIndexBody } from "lib/middlewares";
import Cors from 'cors'


// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)
const bodySchema = yup.object().shape({
    email: yup.string().required(),
}).noUnknown(true).strict();



async function postHandler(req:NextApiRequest, res:NextApiResponse){
    await cors(req, res)
    
    const {email} = req.body
    await findOrCreateAuth(email);
    const auth = await sendCode(email)     
    const emailSended = await sendCodeEmail(email,auth.data.code) 
    res.status(200).send({emailSended})
    
}

const handler = methods({
    post: postHandler
})
export default yupAuthIndexBody(bodySchema,handler)