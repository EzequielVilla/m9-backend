import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import parseToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import Cors from "cors";

interface YupFunction {
  (req: NextApiRequest, res: NextApiResponse): Promise<void>;
}
interface callbackFunction {
  (req: NextApiRequest, res: NextApiResponse): void;
}

import mongoose from "mongoose";
import { parseBody } from "next/dist/server/api-utils";

export const connectDB = (handler) => async (req, res) => {
  try {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return handler(req, res);
    }
    // Use new db connection
    await mongoose.connect(process.env.mongodburl);
    return handler(req, res);
  } catch (error) {
    console.error(error);
  }
};

// Initialize the cors middleware
export const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  })
);
export default function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export function authMiddleware(callback?) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res);
    const token = parseToken(req);
    if (!token) {
      res.status(401).send({
        message: "No hay decodedToken",
      });
    }
    const decodedToken: string = decode(token);
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      res.status(401).send({ mesagge: "Token incorrecto" });
    }
  };
}

export function yupMiddleware(
  schema: yup.ObjectSchema<any>,
  callback: callbackFunction
): YupFunction {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    await cors(req, res);
    const toValidate = req.body
      ? { req: req.body, field: "body" }
      : { req: req.query, field: "query" };

    try {
      await schema.validate(toValidate.req);
      callback(req, res);
    } catch (e) {
      res.status(422).send({ field: toValidate.field, message: e });
    }
  };
}
