import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware, yupMiddleware } from "lib/middlewares";
import { User } from "models/user";
import { upgradeUser } from "controllers/user";

const bodySchema = yup.object().shape({
  address: yup.string().required(),
});
async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const newAddress = req.body.address;
  const userId = new User(token.userId).id;
  const upgradedAddress = await upgradeUser({ address: newAddress }, userId);

  if (upgradedAddress) {
    res.status(200).send({
      messagge: "user upgraded",
      upgraded: true,
    });
  } else {
    res.status(400).send({
      messagge: "error during the operation",
      upgraded: false,
    });
  }
}

const patch = authMiddleware(patchHandler);
const handler = methods({
  patch,
});
export default yupMiddleware(bodySchema, handler);
