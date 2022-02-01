import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { createOrder, getDataForPreference } from "lib/orders";
import { sendBuyerEmail, sendSellerEmail } from "lib/sendgrid";
import { Order } from "models/orders";
import { User } from "models/user";





export async function getRedirectAndCreateOrder(productId:string, token,data?):Promise<string>{
    const user = new User(token.userId)     
    await user.pull()
    const userEmail = user.data.email;
    const userId= user.id; 
    const newOrder = await createOrder(userId,productId,data) 
    const orderData:orderData = newOrder.data;
    const orderId = newOrder.id;
    const dataForPreference = getDataForPreference(orderData,orderId,userEmail);
    const resPreference = await createPreference(dataForPreference)    
    return resPreference.init_point;
}

export async function getOrderFromDB(orderId:string):Promise<orderData>{
    return await Order.getOrderById(orderId);  
    
}

export async function getOrderStatus(id:string, topic:string){
    if(topic == "merchant_order") return await getMerchantOrder(id);
}

export async function checkOrderStatusAndProcess(order):Promise<string>{
    if(order.order_status == "paid"){
        const orderId:string= order.external_reference;
        const myOrder = new Order(orderId);
        await myOrder.pull();
        myOrder.data.status = true;
        await myOrder.push();
        const buyerEmail = order.payer.email;
        const sellerEmail = order.collector.email;
        const itemSelled = order.items
        sendBuyerEmail(buyerEmail);
        sendSellerEmail(sellerEmail, itemSelled );
        return orderId;
    }
}


