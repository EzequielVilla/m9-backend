import type { NextApiRequest, NextApiResponse } from "next";
import { getOrderId } from "controllers/orders";
import methods from "micro-method-router";
import * as yup from "yup";
import { yupMiddleware } from "lib/middlewares";

const querySchema = yup
  .object()
  .shape({
    topic: yup.string().required(),
    id: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  const topic = req.query.topic as string;
  const orderId = await getOrderId(id, topic);
  res.status(200).send({
    orderId,
  });
}

const handler = methods({
  post: postHandler,
});

export default yupMiddleware(querySchema, handler);
