import { MongoClient, } from "mongodb";
import config from "../config/config";
import logger from "../helper/logger";

export const client = new MongoClient(config.MONGO_DB_URI, {
});
export function connectToTable(tableName: string) {
  return client.db(config.DB_COLLECTION_NAME).collection(tableName);
}

export async function connect() {
  try {
    logger.info("mongodbs start");

    await client.connect();
    logger.info("mongodb ~gl~connected");
  } catch (error) {
    console.log(error);
    logger.error("connect mongodb failed");
    logger.error(error.message);
  }
}


