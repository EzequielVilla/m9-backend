import { Order } from "models/orders";
import { searchById } from "models/products";
import { User } from "models/user";
import { getMerchantOrder } from "./mercadopago";
import { sendBuyerEmail, sendSellerEmail } from "./sendgrid";

interface ProductData {
  unitCost: number;
  name: string;
  inStock: boolean;
}

export async function getOrderStatus(id: string, topic: string) {
  if (topic == "merchant_order") return await getMerchantOrder(id);
}

export async function checkOrderStatusAndProcess(order): Promise<string> {
  if (order.order_status == "paid") {
    const orderId: string = order.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = true;
    await myOrder.push();
    //modificar esto por que usuario vendio, el order.collector.email no funciona.
    const sellerEmail = order.collector.email;
    const userId = myOrder.data.userId;
    const buyer = new User(userId);
    await buyer.pull();
    const buyerEmail = buyer.data.email;
    const itemSelled = order.items;
    console.log({ buyerEmail, buyer, userId, myOrder });

    sendBuyerEmail(buyerEmail, itemSelled);
    sendSellerEmail(sellerEmail, itemSelled);
    return orderId;
  }
}

export async function createOrder(
  userId: string,
  productId: string,
  extraData?
): Promise<Order> {
  const productData = await searchById(productId);
  const data = getDataFromProduct(productData);
  const { unitCost, name, inStock } = data;
  if (extraData) {
    // status is false or use with "pending"
    const newOrder = await Order.createNewOrder({
      additionalInfo: extraData,
      userId,
      productId,
      title: name,
      unit_price: unitCost,
      status: false,
    });
    return newOrder;
  } else {
    const newOrder = await Order.createNewOrder({
      userId,
      productId,
      title: name,
      unit_price: unitCost,
      status: false,
    });
    return newOrder;
  }
}

//productData come from algolia

function getDataFromProduct(productData): ProductData {
  const unitCost = productData["Unit cost"];
  const name = productData["Name"];
  const inStock = productData["In stock"];
  const data = { unitCost, name, inStock };
  return data;
}

export function getDataForPreference(
  orderData: orderData,
  orderId: string,
  userEmail: string
) {
  const notificationURL =
    process.env.NODE_ENV == "development"
      ? "https://webhook.site/b90263f2-9714-4b44-8b3a-2af1f61d2d3a"
      : "https://m9-desafio.vercel.app/api/ipn/mercadopago";
  //userEmail is for payer email
  return {
    items: [
      {
        title: orderData.title,
        description: "Dummy description",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "cat123",
        quantity: 1,
        currency_id: "ARS",
        unit_price: orderData.unit_price,
      },
    ],
    back_urls: {
      success: "https://e-commerce-m10.vercel.app/",
      pending: "",
      failure: "",
    },
    external_reference: orderId,
    notification_url: notificationURL,
    collector: {
      email: "",
    },
    payer: {
      email: ``,
    },
  };
}
