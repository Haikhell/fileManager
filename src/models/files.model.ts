import { ObjectId } from "mongodb";

export interface File {
  _id?: ObjectId;
  originalName: string
  newName: string
  ownerId: string
}