import { MulterAzureStorage, MASNameResolver } from "multer-azure-blob-storage";
import multer from "multer";
import config from "../../config/config";
import CustomRequest from "../../interfaces/requestWithUser.interface";

const resolveBlobName: MASNameResolver = (
  req: CustomRequest, file: Express.Multer.File
): Promise<string> => {
  return new Promise<string>((resolve) => {
    resolve(`${Date.now()}_${file.originalname}`);
  });
};

const resolveContainerName: MASNameResolver = (
  req: CustomRequest,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const user = req.user;

    if (user.login) {
      resolve(user.login);
    } else {
      reject("user not found");
    }
  });
};

const azureStorage: MulterAzureStorage = new MulterAzureStorage({
  connectionString: config.AZURE_CONNECTION_STRING,
  accessKey: config.AZURE_SECRET_KEY,
  accountName: config.ACCOUNT_NAME_DEV,
  containerName: resolveContainerName,
  blobName: resolveBlobName,
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

export const upload = multer({
  storage: azureStorage
});
