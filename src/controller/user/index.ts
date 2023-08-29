import express from "express";
import jwt from "jsonwebtoken";
import * as mongodb from "mongodb";
import generator from "generate-password";
import { IRegisterOrLoginUser } from "./interfaces";
import { compare } from "../../helper/security";
import { connectToTable } from "../../db/connect";
import tableNames from "../../db/tableNames";
import { hashPassword } from "../../helper/security";
import config from "../../config/config";
import CustomRequest from "../../interfaces/requestWithUser.interface";


class UserController {
  public path = "/user";

  public router = express.Router();

  private dbConnect: mongodb.Collection<mongodb.Document>;

  constructor() {
    this.intializeRoutes();

    this.dbConnect = connectToTable(tableNames.USERS);
  }

  private intializeRoutes(): void {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.get(`${this.path}/get`, this.getUser);
  }

  register = async (req: express.Request, res: express.Response) => {
    const { login, password } = req.body;

    try {
      const isBusyLogin = await this.dbConnect.findOne({
        login
      });

      if (isBusyLogin) {
        res.send({
          message: "login is busy"
        });
        return;
      }

      const passwordHash = await hashPassword(password);

      await this.dbConnect.insertOne({
        login,
        hashPassword: passwordHash,
        authToken: generator.generate({ length: 16, numbers: true })
      });

      res.send({
        message: "success"
      });

    } catch (error) {
      console.log(error);
      res.send({
        message: "error register user"
      });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    const { login, password }: IRegisterOrLoginUser = req.body;

    try {
      console.log(login);

      const user = await this.dbConnect.findOne({
        login
      });

      if (!user) {
        res.send({
          message: "user not found"
        });
        return;
      }

      console.log(user);
      console.log(password);

      if (!(await compare(password, user.hashPassword))) {
        res.send({
          message: "incorrect password"
        });
        return;
      }

      res.send({
        token: jwt.sign(
          { authKey: user.authToken },
          config.JWT_SECRET,
          { expiresIn: config.JWT_EXPIRE },
        )
      });


    } catch (error) {
      console.log(error);
    }

  };

  getUser = async (req: CustomRequest, res: express.Response) => {
    return res.send(req.user);
  };

}

export default UserController;
