
import { Order } from "models/orders";
import { searchById } from "models/products";

interface ProductData{
    unitCost: number,
    name:string,
    inStock:boolean
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

export function getDataForPreference(orderData:orderData, orderId:string,userEmail:string){
    const notificationURL = process.env.NODE_ENV == "development"? 
                        "https://webhook.site/ccd207f0-8a90-451c-a893-4c6954014ebe":
                        'direccionvercel/api/ipn/mercadopago';
      
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



//productData come from algolia

function getDataFromProduct(productData):ProductData{
    const unitCost = productData["Unit cost"];
    const name = productData["Name"];
    const inStock = productData["In stock"];
    const data = {unitCost,name,inStock};
    return data;
}