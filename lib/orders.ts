
import { Order } from "models/orders";
import { searchById } from "models/products";
import { getMerchantOrder } from "./mercadopago";
import { sendBuyerEmail, sendSellerEmail } from "./sendgrid";

interface ProductData{
    unitCost: number,
    name:string,
    inStock:boolean
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

export async function createOrder(userId:string,productId:string,extraData?):Promise<Order>{    
    const productData = await searchById(productId);    
    const data = getDataFromProduct(productData);
    const {unitCost,name,inStock} = data;
    if(extraData){

        // status is false or use with "pending"
        const newOrder = await Order.createNewOrder({
            additionalInfo: extraData,
            userId,
            productId,
            title: name,
            unit_price: unitCost,
            status: false,
        })
        return newOrder
    } else{
        const newOrder = await Order.createNewOrder({
            userId,
            productId,
            title: name,
            unit_price: unitCost,
            status: false,
        })
        return newOrder
    }           
}

//productData come from algolia

function getDataFromProduct(productData):ProductData{
    const unitCost = productData["Unit cost"];
    const name = productData["Name"];
    const inStock = productData["In stock"];
    const data = {unitCost,name,inStock};
    return data;
}

export function getDataForPreference(orderData:orderData, orderId:string,userEmail:string){
    const notificationURL = process.env.NODE_ENV == "development"? 
                        "https://webhook.site/ccd207f0-8a90-451c-a893-4c6954014ebe":
                        'https://dm9-desafio.vercel.app/api/ipn/mercadopago';
    //userEmail is for payer email  
    return {
        "items": [
            {
              "title": orderData.title,
              "description": "Dummy description",
              "picture_url": "http://www.myapp.com/myimage.jpg",
              "category_id": "cat123",
              "quantity": 1,
              "currency_id": "ARS",
              "unit_price": orderData.unit_price
            }
          ],
          "back_urls": {
              "success": "https://apx.school",
              "pending": "",
              "failure": ""
          },
          "external_reference": orderId,
          "notification_url": notificationURL,
          "collector":{
              "email": ""
          },
          "payer":{
            "email": ""
          }
         
    }
}


