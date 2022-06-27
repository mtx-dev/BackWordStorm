import { Types } from "mongoose";
import { IUser } from "../interfaces/IUser";

export class UserDto {
  id: Types.ObjectId;
  email: string;
  isActivated: boolean;

  constructor(model: IUser) {
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}
