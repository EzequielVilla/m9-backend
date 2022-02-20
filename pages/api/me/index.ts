import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { authMiddleware,yupMeIndexBody } from "lib/middlewares";
import { User } from "models/user";
import * as yup from "yup"
import { upgradeUser } from "controllers/user";
import { upgradeMailInAuth } from "controllers/auth";


const bodySchema = yup.object().shape({
    email: yup.string().required(),
    other: yup.object(),
});

async function getHandler(req:NextApiRequest, res:NextApiResponse, token){
    const user = new User(token.userId)
    await user.pull()    
    const data = user.data
    
    res.send({data})
}

async function patchHandler(req:NextApiRequest, res:NextApiResponse, token){
    const newEmail = req.body.email;
    const {other} = req.body;    
    const userId = new User(token.userId).id;
    const upgradedUser = await upgradeUser({email:newEmail,other},userId);
    const upgradedAuth = await upgradeMailInAuth(newEmail,userId)
    
    if(upgradedUser == upgradedAuth){
        res.status(200).send({
            messagge:"user upgraded",
            upgraded:true
        })
    }else{
        res.status(400).send({
            messagge:"error during the operation",
            upgraded:false
        })
    }
}
export default methods({
    get: authMiddleware(getHandler),
    patch:yupMeIndexBody(bodySchema,authMiddleware(patchHandler))
})