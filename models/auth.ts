import {firestore} from "db/firestore"


//La clase es un modelo representa a la base de datos
const collection = firestore.collection("auth");
export class Auth{
    ref:FirebaseFirestore.DocumentReference;
    data:any;
    id:string
    constructor(id){
        this.id = id;
        this.ref = collection.doc(id)
    }

    async pull(){
        const snap = await this.ref.get()
        this.data = snap.data();
    }
    async push(){
        this.ref.update(this.data)
    }
    //busca en la base un registro y nos genera una instancia de nuestro modelo para que le podamos hacer push
    static async findByEmail(email:string):Promise<Auth>{
        const cleanEmail = email.trim().toLowerCase();
        
        
        const results = await collection.where("email", "==", cleanEmail).get()
        
        
        
        
        if(results.docs.length){
            const first = results.docs[0]
            const newAuth = new Auth(first.id)
            newAuth.data = first.data();
            
            
            return newAuth;
        }       
    }
    static async createNewAuth(data):Promise<Auth>{
        const newUserSnap = await collection.add(data)
        const newUser = new Auth(newUserSnap.id);
        newUser.data = data;
        return newUser;
    }
    static async upgradeDataByUserId(newEmail:string, userId:string):Promise<boolean>{
        const cleanEmail = newEmail.trim().toLowerCase();
        const result = await collection.where("userId", "==", userId).get()
        if(result.docs.length){
            const id = result.docs[0].id;
            await collection.doc(id).update({email:cleanEmail})
            return true;         
        }else return false;
    }
}