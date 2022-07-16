import mongoose from "mongoose";
const { Schema, model } = mongoose;

import { VOCABULARY_COLLECTION } from "../config/index.js";

const VocabularySchema = new Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const virtual = VocabularySchema.virtual("id");
virtual.set(function (value) {
  this._id = value;
});
virtual.get(function () {
  return this._id;
});

export default model("Vocabulary", VocabularySchema, VOCABULARY_COLLECTION);
