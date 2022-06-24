import { Types } from "mongoose";
import { IUser } from "../interfaces/IUser";

export class UserDto {
  email: string;
  id: Types.ObjectId;
  isActivated: boolean;

  constructor(model: IUser) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}
