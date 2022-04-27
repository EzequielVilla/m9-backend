import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware, yupOrderQuery } from "lib/middlewares";
import { getRedirectAndIdAndCreateOrder } from "controllers/orders";

const querySchema = yup.object().shape({
  productId: yup.string().required(),
  data: yup.object(),
});
interface dataFromBody {
  data: {};
}

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const productId = req.query.productId as string;
  const { data } = req.body as dataFromBody;

  const { redirectTo, orderId } = await getRedirectAndIdAndCreateOrder(
    productId,
    token,
    data
  );
  res.status(200).send({
    redirectTo,
    orderId,
  });
}

const post = authMiddleware(postHandler);
const handler = methods({
  post,
});

export default yupOrderQuery(querySchema, handler);
