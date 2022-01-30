import {firestore} from "db/firestore"
const collection = firestore.collection("users");
export class User{
    ref:FirebaseFirestore.DocumentReference;
    data:any;
    id:string;
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

    static async createNewUser(data):Promise<User>{
    const newUserSnap = await collection.add(data)
    const newUser = new User(newUserSnap.id);
    newUser.data = data;  
    return newUser;
    }
    static async upgradeDataByUserId(newData:upgradeData, dataId:string):Promise<boolean>{        
        const upgradedUser = await collection.doc(dataId).update(newData)
        return upgradedUser? true:false;
    }
}