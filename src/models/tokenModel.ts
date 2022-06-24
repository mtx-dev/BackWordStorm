import { Schema, model, Types } from "mongoose";

export interface ITokenDbModel {
  user: Types.ObjectId;
  refreshToken: string;
}

const TokenSchema = new Schema<ITokenDbModel>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

export default model<ITokenDbModel>("Token", TokenSchema);
