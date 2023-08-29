import { Request } from "express";
import { User } from "../models/user.model";
import { File } from "../models/files.model";


interface CustomRequest extends Request {
  user: User;
  fileUpdate?: File
}

export default CustomRequest;