import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllProducts } from "controllers/searchs";
import { cors } from "lib/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await getAllProducts();
  if (result) {
    res.status(200).send({
      result,
    });
  } else {
    res.status(400).send({
      message: "No product finded with that id",
    });
  }
}

const handler = methods({
  options: cors,
  get: getHandler,
});

export default handler;
