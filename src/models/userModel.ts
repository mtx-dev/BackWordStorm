import { Schema, model } from "mongoose";
import { IUser, ISettings } from "../interfaces/IUser";

const SettingsSchema = new Schema<ISettings>({
  language: { type: String, default: "Russian" },
  allowedQuizes: {
    type: [String],
    required: true,
    default: ["Translate", "ReverseTranslate", "Listen", "Spell"],
  },
  allowVioce: { type: Boolean, default: true },
  voice: { type: String, default: "3" },
  theme: { type: String, default: "default" },
});

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  activationLink: { type: String },
  // TODO: realize Activations
  isActivated: { type: Boolean, default: true },
  settings: { type: SettingsSchema, required: true },
});

export default model<IUser>("User", UserSchema);
