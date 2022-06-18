import {
  ENGLISH_DICTIONARY_COLLECTION,
  RUSSIAN_DICTIONARY_COLLECTION,
} from "../config";

import { Schema, model } from "mongoose";

const DictionarySchema = new Schema({
  word: { type: String, unique: true, required: true },
  translations: [{ type: String }],
});

const EngDictionaryModel = model(
  "Dictionary",
  DictionarySchema,
  ENGLISH_DICTIONARY_COLLECTION
);
const RusDictionaryModel = model(
  "Dictionary",
  DictionarySchema,
  RUSSIAN_DICTIONARY_COLLECTION
);

export default { EngDictionaryModel, RusDictionaryModel };
