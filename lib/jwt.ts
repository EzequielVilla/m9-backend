import jwt from "jsonwebtoken"


export function generate(obj):string{
    return jwt.sign(obj, process.env.JWT_SECRET)
}
export function decode(token):string{
    try {
        
        return jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        console.error("token incorrecto");
        return null;
        
    }
}