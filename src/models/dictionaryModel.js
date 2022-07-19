import mongoose from "mongoose";
const { Schema, model } = mongoose;

import {
  ENGLISH_DICTIONARY_COLLECTION,
  RUSSIAN_DICTIONARY_COLLECTION,
} from "../config/index.js";

const DictionarySchema = new Schema(
  {
    word: { type: String, unique: true, required: true },
    translations: [{ type: String }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const virtual = DictionarySchema.virtual("id");
virtual.set(function (value) {
  this._id = value;
});
virtual.get(function () {
  return this._id;
});

export const EngDictionaryModel = model(
  "Dictionary",
  DictionarySchema,
  ENGLISH_DICTIONARY_COLLECTION
);
export const RusDictionaryModel = model(
  "Dictionary",
  DictionarySchema,
  RUSSIAN_DICTIONARY_COLLECTION
);
