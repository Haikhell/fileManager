import { connectToTable } from "../db/connect";
import tableNames from "../db/tableNames";
import CustomRequest from "../interfaces/requestWithUser.interface";
import express from "express";
import { File } from "../models/files.model";
import { ObjectId } from "mongodb";


export default async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const dbConnect = connectToTable(tableNames.FILES);

  const { idFile } = req.query;

  console.log(idFile);

  const resultDb = await dbConnect.findOne({
    _id: new ObjectId(idFile as string)
  });

  if (resultDb) {
    req.fileUpdate = resultDb as File;
    next();

    return;
  }

  res.send({
    message: "file not found"
  });
  return;
};
