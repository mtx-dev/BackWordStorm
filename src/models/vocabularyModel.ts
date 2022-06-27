import { VOCABULARY_COLLECTION } from "../config";
import { Schema, model, Types } from "mongoose";

export enum WordStatus {
  "unknown",
  "study",
  "learned",
}

export interface IVocabularyModel {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  word: string;
  translation: string;
  note: string;
  status: WordStatus;
  lastSuccessful: string;
  attempts: number;
  successfulAttempts: number;
  active: boolean;
}

const VocabularySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  word: { type: String, required: true },
  translation: { type: String, required: true },
  note: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["unknown", "study", "learned"],
    default: "unknown",
  },
  lastSuccessful: { type: Date, default: null },
  attempts: { type: Number, default: 0 },
  successfulAttempts: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

export default model<IVocabularyModel>(
  "Vocabulary",
  VocabularySchema,
  VOCABULARY_COLLECTION
);
