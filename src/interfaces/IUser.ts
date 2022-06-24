import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: Types.ObjectId;
  email: string;
  password: string;
  activationLink?: string;
  isActivated: boolean;
  settings: ISettings;
}

export interface ISettings {
  voice: string | null;
  allowVioce: boolean;
  allowedQuizes: string[];
  language: string;
  theme: string;
}
