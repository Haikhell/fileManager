import App from "./app";
import config from "./config/config";
import FileController from "./controller/fileManager";
import UserController from "./controller/user";
import { connect } from "./db/connect";

async function server() {
  await connect();
  console.log(config.PORT);
  const app: App = new App(
    [
      new UserController(),
      new FileController()
    ],
    Number(config.PORT),
  );

  return app.listen();
}

export default server;

