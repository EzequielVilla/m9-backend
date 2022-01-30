import {User} from "models/user";
import { Auth } from "models/auth";
import addDays from "date-fns/addDays";
import gen from "random-seed";


let random = gen.create();
 
export async function findOrCreateAuth(email:string):Promise<Auth>{
    const cleanEmail = email.trim().toLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);

    if(auth)return auth;
    else{
        //necesita crear un usuario para tener el id y pasarlo en el parametro
        const newUser = await User.createNewUser({
            email:cleanEmail,
        })
        const newAuth = await Auth.createNewAuth({
            email:cleanEmail,
            userId:newUser.id,
            code:"",
            expires: new Date()
        })
        return newAuth;
    }
}

export async function sendCode(email:string):Promise<Auth>{
    const auth = await findOrCreateAuth(email);
    const code = random.intBetween(10000,99999);    
    const now = new Date();
    const oneDay =addDays(now,24);
    auth.data.code = code ;
    auth.data.expires = oneDay;
    await auth.push();
    return auth;
}

export async function upgradeMailInAuth(email:string,userId:string):Promise<boolean>{
    const cleanEmail = email.trim().toLowerCase();
    const isUpgraded = await Auth.upgradeDataByUserId(cleanEmail,userId)
    return isUpgraded;

}
//for api/auth/token
export function checkCodeAndExpiration(code:number, codeFromBody:number, expires:Timestamp):boolean{
    return (compareCode(code,codeFromBody) && isExpired(expires));
}
function compareCode(code:number, codeFromBody:number):boolean{
    return code === codeFromBody;
}
function isExpired(expires:Timestamp):boolean{
    const nowTime = new Date().getTime()/1000;
    const expireTime = expires._seconds;
    return nowTime<expireTime 
    
}