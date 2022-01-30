import mercadopago from "mercadopago"
import parseToken from "parse-bearer-token";




mercadopago.configure({
    access_token: process.env.MP_TOKEN
});

export async function getMerchantOrder(id){
    const res = await mercadopago.merchant_orders.get(id);
    return res.body;
}

export async function createPreference(bodyData){

    
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SELLER_TOKEN}`,
        },
        body: JSON.stringify(bodyData),
      });
    const data = await res.json();
    return data
    
}