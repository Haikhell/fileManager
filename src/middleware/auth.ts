import jwt from "jsonwebtoken";
import * as express from "express";
import config from "../config/config";
import { connectToTable } from "../db/connect";
import tableNames from "../db/tableNames";
import logger from "../helper/logger";
import CustomRequest from "../interfaces/requestWithUser.interface";

export default async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const bearerHeader: string | undefined = req.headers.authorization;

  if (!bearerHeader) {

    return next();
  }

  const token: string[] = bearerHeader.split(" ");

  if (!token || !token[1]) {

    return next();
  }

  try {
    const options = async (error, tokenData) => {
      console.log(tokenData);

      if (error) return res.send("token error");
      const dbConnect = connectToTable(tableNames.USERS);

      return dbConnect.findOne({
        authToken: tokenData.authKey,
      });
    };

    const result = await jwt.verify(token[1], config.JWT_SECRET, options);
    req.user = JSON.parse(JSON.stringify(result));
    return next();
  } catch (error) {
    res.send("token not found");
    logger.error(error);
    return;

  }
};
