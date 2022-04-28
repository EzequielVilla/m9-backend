import { createPreference, getMerchantOrder } from "lib/mercadopago";
import {
  checkOrderStatusAndProcess,
  createOrder,
  getDataForPreference,
  getOrderStatus,
} from "lib/orders";
import { sendBuyerEmail, sendSellerEmail } from "lib/sendgrid";
import { Order } from "models/orders";
import { User } from "models/user";

interface RedirectAndId {
  redirectTo: string;
  orderId: string;
}

export async function getRedirectAndIdAndCreateOrder(
  productId: string,
  token,
  data?
): Promise<RedirectAndId> {
  const user = new User(token.userId);
  await user.pull();
  const userEmail = user.data.email;
  const userId = user.id;
  const newOrder = await createOrder(userId, productId, data);
  const orderData: orderData = newOrder.data;
  const orderId = newOrder.id;
  const dataForPreference = getDataForPreference(orderData, orderId, userEmail);

  const resPreference = await createPreference(dataForPreference);
  const resData = {
    redirectTo: resPreference.init_point,
    orderId,
  };
  return resData;
}

export async function getOrderFromDB(orderId: string): Promise<orderData> {
  return await Order.getOrderById(orderId);
}

export async function getOrderId(id: string, topic: string) {
  const order = await getOrderStatus(id, topic);
  const orderId = await checkOrderStatusAndProcess(order);
  return orderId;
}
