import { Types } from "mongoose";
import { IVocabularyModel, WordStatus } from "../models/vocabularyModel";

export class VocabularyWordDto {
  id: Types.ObjectId;
  word: string;
  translation: string;
  note: string;
  status: WordStatus;
  lastSuccessful: string;
  attempts: number;
  successfulAttempts: number;
  active: boolean;

  constructor(model: IVocabularyModel) {
    this.id = model.id;
    this.word = model.word;
    this.translation = model.translation;
    this.note = model.note;
    this.status = model.status;
    this.lastSuccessful = model.lastSuccessful;
    this.attempts = model.attempts;
    this.successfulAttempts = model.successfulAttempts;
    this.active = model.active;
  }
}
