import { config } from "dotenv";

config();

const { env } = process;

const { NODE_ENV = "development" } = env;

const conf = {
  development: {
    MONGO_DB_URI: env.MONGO_DB_URI_DEV,
    DB_COLLECTION_NAME: env.DB_COLLECTION_NAME_DEV,
    PORT: env.PORT,
    FILES_PATH: `${process.cwd()}/files`,
    DIRNAME: `${process.cwd()}`,
    JWT_SECRET: env.JWT_SECRET_DEV,
    JWT_EXPIRE: env.JWT_EXPIRE_DEV,
    AZURE_ACCOUNT_NAME: env.ACCOUNT_NAME_DEV,
    AZURE_SECRET_KEY: env.AZURE_SECRET_KEY_DEV,
    AZURE_CONNECTION_STRING: env.AZURE_CONNECTION_STRING_DEV,
  },
  production: {
    DIRNAME: `${process.cwd()}`,
    MONGO_DB_URI: env.MONGO_DB_URI_PROD,
    FILES_PATH: `${process.cwd()}/files`,
    PORT: env.PORT,
    JWT_SECRET: env.JWT_SECRET_PROD,
    JWT_EXPIRE: env.JWT_EXPIRE_PROD,
    AZURE_SECRET_KEY: env.AZURE_SECRET_KEY_PROD,
    AZURE_CONNECTION_STRING: env.AZURE_CONNECTION_STRING_PROD,
    DB_COLLECTION_NAME: env.DB_COLLECTION_NAME_PROD,

  },
};

export default conf[NODE_ENV];
