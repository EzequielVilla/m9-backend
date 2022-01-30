import { User } from "models/user";


export async function upgradeUser(data:upgradeData, userId:string):Promise<boolean>{
    const {email,address,other} = data;
    if(email || other) return upgradeEmailOrOthers(userId, email,other);
    else if(address) return upgradeAddress(userId,address);
}

async function upgradeEmailOrOthers(userId:string, email?:string, other?:any,):Promise<boolean>{
    if(email && other){
        const cleanEmail = email.trim().toLowerCase();
        return await User.upgradeDataByUserId({email:cleanEmail, other},userId)
    }else if(email){
        const cleanEmail = email.trim().toLowerCase();
        return await User.upgradeDataByUserId({email:cleanEmail},userId)
    } else if(other){
        return await User.upgradeDataByUserId({other},userId)
    } 
}

async function upgradeAddress(userId:string,address:string):Promise<boolean>{
    return await User.upgradeDataByUserId({address}, userId);
}
