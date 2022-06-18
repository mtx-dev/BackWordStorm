import { VOCABULARY_COLLECTION } from "../config";
import { Schema, model } from "mongoose";

const VocaularySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  word: { type: String, required: true },
  translation: { type: String, required: true },
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

export default model("Vocaulary", VocaularySchema, VOCABULARY_COLLECTION);
