import type { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth, sendCode } from "controllers/auth";
import { sendCodeEmail } from "lib/sendgrid";
import methods from "micro-method-router";
import * as yup from "yup";
import initMiddleware, { yupMiddleware } from "lib/middlewares";

const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  await findOrCreateAuth(email);
  const auth = await sendCode(email);
  const emailSended = await sendCodeEmail(email, auth.data.code);
  res.status(200).send({ emailSended });
}

const handler = methods({
  post: postHandler,
});
export default yupMiddleware(bodySchema, handler);
