import { firestore } from "db/firestore";

const collection = firestore.collection("order");
export class Order{

    ref: FirebaseFirestore.DocumentReference;
    data:any
    id:string
    constructor(id){
        this.id = id;
        this.ref = collection.doc(id);
    }
    async pull(){
        const snap = await this.ref.get()
        this.data = snap.data();
    }
    async push(){
        this.ref.update(this.data)
    }

    static async createNewOrder(data){
        const newOrderSnap = await collection.add(data)
        const newOrder = new Order(newOrderSnap.id);
        newOrder.data = data;
        return newOrder;
        }
    static async getOrderById(orderId:string):Promise<any>{
        return (await (collection.doc(orderId).get())).data();

        
    }    
}

