import * as bodyParser from "body-parser";
import cors from "cors";
import express, { RequestHandler } from "express";
import logger from "./helper/logger";
import middleware from "./middleware";

class App {
  public app: express.Application;

  public port: number;

  constructor(controllers, port: number) {
    this.app = express();
    this.port = port;
    console.log("init app");
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    console.log("inited");

  }

  private async initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cors() as RequestHandler);
    this.app.use(middleware.auth);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
