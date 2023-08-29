import express from "express";
import * as mongodb from "mongodb";
import { connectToTable } from "../../db/connect";
import tableNames from "../../db/tableNames";
import { upload } from "../../helper/multer";
import config from "../../config/config";
import { BlobServiceClient } from "@azure/storage-blob";

import CustomRequest from "../../interfaces/requestWithUser.interface";
import checkAuthUser from "../../middleware/checkAuthUser";
import getFile from "../../middleware/file";



class FileController {
  public path = "/file";

  public router = express.Router();

  private dbConnect: mongodb.Collection<mongodb.Document>;

  private blobServiceClientManager: BlobServiceClient;

  constructor() {
    this.intializeRoutes();

    this.dbConnect = connectToTable(tableNames.FILES);

    this.blobServiceClientManager = BlobServiceClient.fromConnectionString(config.AZURE_CONNECTION_STRING);
  }

  private intializeRoutes(): void {
    this.router.post(`${this.path}/load`, checkAuthUser, upload.single("file"), this.loadFile);
    this.router.post(`${this.path}/update`, checkAuthUser, getFile, upload.single("file"), this.updateFile);
    this.router.delete(`${this.path}/delete`, checkAuthUser, getFile, this.deleteFile);
    this.router.get(`${this.path}/getMy`, checkAuthUser, this.getMyFiles);
  }

  loadFile = async (req: CustomRequest, res: express.Response) => {
    const user = req.user;

    const file = JSON.parse(JSON.stringify(req.file));

    console.log(file);

    const info = {
      originalName: file.originalname,
      newName: file.blobName,
      ownerId: user._id
    };

    await this.dbConnect.insertOne(info);

    res.send({
      file: info
    });
  };

  deleteFile = async (req: CustomRequest, res: express.Response) => {
    const user = req.user;
    console.log(req.fileUpdate);
    const { _id, newName, ownerId } = req.fileUpdate;

    if (ownerId !== user._id.toString()) {
      res.send({
        message: "don't have permission"
      });
      return;
    }
    console.log("start container");
    const container = this.blobServiceClientManager.getContainerClient(user.login);
    const blockBlobClient = container.getBlockBlobClient(newName);
    await blockBlobClient.delete();

    await this.dbConnect.deleteOne({
      _id
    });

    res.send({
      message: "file is deleted"
    });

  };

  updateFile = async (req: CustomRequest, res: express.Response) => {
    const user = req.user;
    const { _id, ownerId } = req.fileUpdate;

    const file = JSON.parse(JSON.stringify(req.file));

    if (ownerId !== user._id.toString()) {
      res.send({
        message: "don't have permission"
      });
      return;
    }

    await this.dbConnect.updateOne({
      _id
    }, {
      $set: {
        newName: file.blobName,
      }
    });

    res.send({
      message: "file is updated"
    });

  };

  getMyFiles = async (req: CustomRequest, res: express.Response) => {
    const user = req.user;

    // const container = this.blobServiceClientManager.getContainerClient(user.login);

    // const blobs = container.listBlobsFlat();
    // let i = 1;
    // for await (const blob of blobs) {
    //   console.log(`Blob ${i++}: ${blob.name}`);
    // }

    return this.dbConnect.find({
      ownerId: user._id
    })
  };

}

export default FileController;
