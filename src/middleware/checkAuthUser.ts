import * as express from "express";
import CustomRequest from "../interfaces/requestWithUser.interface";

export default async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  if (!req.user) {
    res.send({
      message: "user not found"
    });
  }
  next();
};
