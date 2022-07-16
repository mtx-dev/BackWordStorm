import { Types } from "mongoose";
import { ISettings, IUser } from "../interfaces/IUser";

export class UserDto {
  id: Types.ObjectId;
  email: string;
  isActivated: boolean;
  settings: ISettings;

  constructor(model: IUser) {
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.settings = model.settings;
  }

  public toPayload = () => ({
    id: this.id,
    email: this.email,
    isActivated: this.isActivated,
  });
}
